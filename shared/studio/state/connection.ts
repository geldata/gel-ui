import {action, computed} from "mobx";
import {
  createContext,
  model,
  Model,
  prop,
  _async,
  _await,
  Frozen,
} from "mobx-keystone";

import {AuthenticationError, ClientError} from "edgedb";
import {Options} from "edgedb/dist/options";
import LRU from "edgedb/dist/primitives/lru";
import {Capabilities} from "edgedb/dist/baseConn";
import {AdminUIFetchConnection} from "edgedb/dist/fetchConn";
import {
  Cardinality,
  Language,
  OutputFormat,
  ProtocolVersion,
  QueryOptions,
} from "edgedb/dist/ifaces";
import {ICodec} from "edgedb/dist/codecs/ifaces";

import {
  decode,
  EdgeDBSet,
  QueryParams,
  codecsRegistry,
  baseOptions,
} from "../utils/decodeRawBuffer";
import {instanceCtx} from "./instance";
import {sessionStateCtx} from "./sessionState";
import {splitQueryIntoStatements} from "../utils/syntaxTree";

export {Capabilities};
export type {QueryParams};

export interface QueryDuration {
  prepare: number;
  execute: number;
}

export const connCtx = createContext<Connection>();

export interface ConnectConfig {
  serverUrl: string;
  authToken: string;
  database: string;
  user: string;
}

interface QueryResult {
  result: EdgeDBSet | null;
  duration: QueryDuration;
  outCodecBuf: Uint8Array;
  resultBuf: Uint8Array;
  protoVer: ProtocolVersion;
  capabilities: number;
  status: string;
}

interface ParseResult {
  inCodec: ICodec;
  outCodecBuf: Uint8Array;
  protoVer: ProtocolVersion;
  duration: number;
}

type QueryKind = "query" | "parse" | "execute";

type QueryOpts = {
  newCodec?: boolean;
  implicitLimit?: bigint;
  blocking?: boolean;
} & (
  | {
      userQuery?: undefined;
      ignoreSessionConfig?: boolean;
    }
  | {
      userQuery?: boolean;
      ignoreSessionConfig?: undefined;
    }
);

type PendingQuery = {
  language: Language;
  query: string;
  params?: QueryParams;
  opts: QueryOpts;
  abortSignal: AbortSignal | null;
  reject: (error: Error) => void;
} & (
  | {kind: "query"; resolve: (result: QueryResult) => void}
  | {kind: "parse"; resolve: (result: QueryResult) => void}
  | {kind: "execute"; resolve: (result: void) => void}
);

const queryOptions: QueryOptions = {
  injectTypenames: true,
  injectTypeids: true,
  injectObjectids: true,
};

export function createAuthenticatedFetch({
  serverUrl,
  database,
  user,
  authToken,
}: ConnectConfig) {
  const databaseUrl = `${serverUrl}/db/${encodeURIComponent(database)}/`;

  return (path: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      path instanceof Request ? path.url : path,
      databaseUrl
    );

    const headers = new Headers(init?.headers);
    headers.append("X-EdgeDB-User", user);
    headers.append("Authorization", `Bearer ${authToken}`);

    return fetch(url, {
      ...init,
      headers,
    });
  };
}

function initConnPool(
  config: ConnectConfig,
  serverVersion: {major: number; minor: number} | null,
  size = 3
): AdminUIFetchConnection[] {
  const authedFetch = createAuthenticatedFetch(config);

  return Array(size)
    .fill(null)
    .map(() =>
      AdminUIFetchConnection.create(
        authedFetch,
        codecsRegistry,
        serverVersion ? [serverVersion.major, serverVersion.minor] : undefined
      )
    );
}

function setQueryTag(options: Options, tag: string) {
  const annos = new Map((options as any).annotations as Map<string, string>);
  annos.set("tag", tag);
  const clone = (options as any)._cloneWith({});
  clone.annotations = annos;
  return clone as Options;
}

@model("Connection")
export class Connection extends Model({
  config: prop<Frozen<ConnectConfig>>(),
  serverVersion: prop<Frozen<{major: number; minor: number} | null>>(),
}) {
  private _connPool = initConnPool(this.config.data, this.serverVersion.data);

  private _runningBlockingQuery = false;

  private _codecCache = new LRU<string, [any, any, Uint8Array, number]>({
    capacity: 200,
  });
  private _queryQueue: PendingQuery[] = [];

  @computed
  get _state() {
    const sessionState = sessionStateCtx.get(this);

    let state = baseOptions;

    if (sessionState?.activeState.globals.length) {
      state = state.withGlobals(
        sessionState.activeState.globals.reduce((globals, global) => {
          globals[global.name] = global.value;
          return globals;
        }, {} as {[key: string]: any})
      );
    }
    if (sessionState?.activeState.config.length) {
      state = state.withConfig(
        sessionState.activeState.config.reduce((configs, config) => {
          configs[config.name] = config.value;
          return configs;
        }, {} as {[key: string]: any})
      );
    }
    return setQueryTag(state, "gel/ui");
  }

  @computed
  get sessionConfig() {
    const sessionState = sessionStateCtx.get(this);
    if (sessionState === undefined) {
      return {};
    } else {
      return sessionState.activeState.config.reduce((configs, config) => {
        configs[config.name] = config.value;
        return configs;
      }, {} as {[key: string]: any});
    }
  }

  query(
    query: string,
    params?: QueryParams,
    opts: QueryOpts = {},
    abortSignal?: AbortSignal,
    language: Language = Language.EDGEQL
  ): Promise<QueryResult> {
    return this._addQueryToQueue(
      "query",
      language,
      query,
      params,
      abortSignal,
      opts
    );
  }

  parse(
    query: string,
    language: Language = Language.EDGEQL,
    abortSignal?: AbortSignal
  ): Promise<ParseResult> {
    return this._addQueryToQueue(
      "parse",
      language,
      query,
      undefined,
      abortSignal
    );
  }

  execute(
    script: string,
    language: Language = Language.EDGEQL
  ): Promise<void> {
    return this._addQueryToQueue("execute", language, script);
  }

  _addQueryToQueue(
    kind: QueryKind,
    language: Language,
    query: string,
    params?: QueryParams,
    abortSignal: AbortSignal | null = null,
    opts: QueryOpts = {}
  ) {
    return new Promise<any>((resolve, reject) => {
      const pendingQuery: PendingQuery = {
        kind,
        language,
        query,
        params,
        opts,
        abortSignal,
        resolve,
        reject,
      };
      this._queryQueue.push(pendingQuery);

      abortSignal?.addEventListener("abort", () => {
        const queueIndex = this._queryQueue.indexOf(pendingQuery);
        if (queueIndex !== -1) {
          this._queryQueue.splice(queueIndex, 1);
          reject(new DOMException("The operation was aborted.", "AbortError"));
        }
      });

      this._processQueryQueue();
    });
  }

  @action
  async _processQueryQueue() {
    if (this._runningBlockingQuery) return;

    if (this._queryQueue.length && this._connPool.length) {
      const query = this._queryQueue.shift()!;
      this._runningBlockingQuery = query.opts.blocking ?? false;
      const conn = this._connPool.pop()!;
      try {
        const result = await this._query(
          conn,
          query.kind,
          query.language,
          query.query,
          query.opts,
          query.params,
          query.abortSignal
        );
        query.resolve(result as any);
      } catch (e: any) {
        query.reject(e);
      }
      this._connPool.push(conn);
      this._runningBlockingQuery = false;
      this._processQueryQueue();
    }
  }

  private checkAborted(abortSignal: AbortSignal | null) {
    if (abortSignal?.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }
  }

  async _query(
    conn: AdminUIFetchConnection,
    kind: QueryKind,
    language: Language,
    queryString: string,
    opts: QueryOpts,
    params: QueryParams | undefined,
    abortSignal: AbortSignal | null
  ): Promise<QueryResult | ParseResult | void> {
    try {
      this.checkAborted(abortSignal);

      let state = this._state;

      if (opts.ignoreSessionConfig) {
        state = setQueryTag(
          baseOptions
            .withConfig({apply_access_policies: false})
            .withGlobals(state.globals),
          "gel/ui"
        );
      }
      if (opts.userQuery) {
        state = setQueryTag(state, "gel/webrepl");
      } else {
        state = state.withConfig({force_database_error: "false"});
      }

      if (kind === "execute") {
        await conn.rawExecute(
          language,
          queryString,
          state,
          undefined,
          undefined,
          undefined,
          undefined,
          abortSignal
        );
        return;
      }

      const statements = splitQueryIntoStatements(queryString);
      const lastStatement = statements[statements.length - 1];
      const isExplain = lastStatement && /^\s*analyze/i.test(lastStatement);

      if (isExplain) {
        console.log(
          "explain query; disabling typename injection + implicit limits"
        );
      }

      const startTime = performance.now();

      // @ts-ignore - Ignore _ is declared but not used error
      let inCodec, outCodec, outCodecBuf, capabilities, _;

      if (kind !== "parse" && this._codecCache.has(queryString)) {
        [inCodec, outCodec, outCodecBuf, capabilities] =
          this._codecCache.get(queryString)!;
      } else {
        [inCodec, outCodec, _, outCodecBuf, _, capabilities] =
          await conn.rawParse(
            language,
            queryString,
            state,
            isExplain ? {} : queryOptions,
            abortSignal
          );
        this._codecCache.set(queryString, [
          inCodec,
          outCodec,
          outCodecBuf,
          capabilities,
        ]);
      }

      const parseEndTime = performance.now();

      if (kind === "parse") {
        return {
          inCodec,
          outCodecBuf,
          protoVer: conn.protocolVersion,
          duration: Math.round(parseEndTime - startTime),
        };
      }

      this.checkAborted(abortSignal);

      const serverVersion = this.serverVersion.data;
      if (
        (!serverVersion || serverVersion.major >= 6) &&
        !(
          capabilities &
          (Capabilities.MODIFICATONS |
            Capabilities.DDL |
            Capabilities.PERSISTENT_CONFIG)
        ) &&
        (!opts.userQuery || !state.config.has("default_transaction_isolation"))
      ) {
        state = state.withConfig({
          default_transaction_isolation: "RepeatableRead",
        });
      }

      const resultBuf = await conn.rawExecute(
        language,
        queryString,
        state,
        outCodec,
        isExplain ? {} : {...queryOptions, implicitLimit: opts.implicitLimit},
        inCodec,
        params,
        abortSignal
      );

      if (resultBuf.length > 2 ** 28) {
        throw new ClientError("Result is too large to display");
      }

      const newOutCodec = (
        (conn as any).queryCodecCache as LRU<
          string,
          [number, ICodec, ICodec, number]
        >
      ).get(
        (conn as any)._getQueryCacheKey(
          queryString,
          OutputFormat.BINARY,
          Cardinality.MANY
        )
      )?.[2];
      if (newOutCodec && newOutCodec?.tid !== outCodec.tid) {
        this.checkAborted(abortSignal);
        [inCodec, outCodec, _, outCodecBuf, _, capabilities] =
          await conn.rawParse(
            language,
            queryString,
            state,
            isExplain ? {} : queryOptions,
            abortSignal
          );
        this._codecCache.set(queryString, [
          inCodec,
          outCodec,
          outCodecBuf,
          capabilities,
        ]);
      }

      const executeEndTime = performance.now();

      const duration = {
        prepare: Math.round(parseEndTime - startTime),
        execute: Math.round(executeEndTime - parseEndTime),
      };

      return {
        result: decode(
          outCodecBuf,
          resultBuf,
          state,
          conn.protocolVersion,
          opts.newCodec
        ),
        duration,
        outCodecBuf,
        resultBuf,
        protoVer: conn.protocolVersion,
        capabilities,
        status: (conn as any).lastStatus,
      };
    } catch (err) {
      if (err instanceof AuthenticationError) {
        instanceCtx.get(this)!._refreshAuthToken?.();
      }
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new DOMException("Query was canceled by user.", "AbortError");
      }
      throw err;
    }
  }
}
