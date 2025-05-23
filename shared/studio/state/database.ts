import {createContext, useContext} from "react";

import {action, observable, reaction, runInAction, when} from "mobx";
import {
  AnyModel,
  createContext as createMobxContext,
  getTypeInfo,
  idProp,
  Model,
  model,
  ModelClass,
  modelFlow,
  ModelTypeInfo,
  ObjectMap,
  prop,
  _async,
  _await,
  modelAction,
} from "mobx-keystone";

import {
  RawIntrospectionResult,
  getIntrospectionQuery,
} from "@edgedb/common/schemaData/queries";
import {
  buildTypesGraph,
  SchemaType,
  SchemaObjectType,
  SchemaScalarType,
  SchemaFunction,
  SchemaConstraint,
  SchemaPointer,
  SchemaAbstractAnnotation,
  SchemaExtension,
  SchemaAlias,
  SchemaGlobal,
  SchemaOperator,
} from "@edgedb/common/schemaData";
import {EdgeDBVersion} from "@edgedb/common/schemaData/utils";

import {fetchSchemaData, storeSchemaData} from "../idbStore";

import {instanceCtx} from "./instance";
import {Capabilities, connCtx, Connection} from "./connection";
import {SessionState, sessionStateCtx} from "./sessionState";

export const dbCtx = createMobxContext<DatabaseState>();

const SCHEMA_DATA_VERSION = 8;

export interface StoredSchemaData {
  version: number;
  schemaId: string | null;
  schemaLastMigration: string | null | undefined;
  data: RawIntrospectionResult;
}

export interface SchemaData {
  objects: Map<string, SchemaObjectType>;
  objectsByName: Map<string, SchemaObjectType>;
  functions: Map<string, SchemaFunction>;
  operators: Map<string, SchemaOperator>;
  constraints: Map<string, SchemaConstraint>;
  scalars: Map<string, SchemaScalarType>;
  types: Map<string, SchemaType>;
  pointers: Map<string, SchemaPointer>;
  aliases: Map<string, SchemaAlias>;
  globals: Map<string, SchemaGlobal>;
  annotations: Map<string, SchemaAbstractAnnotation>;
  extensions: SchemaExtension[];
  shortNamesByModule: Map<string, Set<string>>;
}

@model("DatabaseState")
export class DatabaseState extends Model({
  $modelId: idProp,
  name: prop<string>(),

  sessionState: prop(() => new SessionState({})),
  tabStates: prop<ObjectMap<AnyModel>>(),
}) {
  @observable.ref
  connection: Connection | null = null;

  @action
  _setConnection(conn: Connection) {
    this.connection = conn;
  }

  _getTabState(modelType: string, stateClass: ModelClass<AnyModel>) {
    if (!this.tabStates.has(modelType)) {
      this._initTabState(stateClass);
    }
    return this.tabStates.get(modelType)!;
  }

  @modelAction
  private _initTabState(stateClass: ModelClass<AnyModel>) {
    const state = new stateClass({});
    this.tabStates.set(state.$modelType, state);
  }

  @observable
  loadingTabs = new Map<string, boolean>();

  @action
  setLoadingTab(stateClass: ModelClass<any>, loading: boolean) {
    this.loadingTabs.set(
      (getTypeInfo(stateClass) as ModelTypeInfo).modelType,
      loading
    );
  }

  refreshCaches(capabilities: number, statuses: string[]) {
    if (capabilities & Capabilities.DDL) {
      if (
        statuses.includes("CREATE DATABASE") ||
        statuses.includes("DROP DATABASE") ||
        statuses.includes("CREATE BRANCH") ||
        statuses.includes("DROP BRANCH") ||
        statuses.includes("ALTER BRANCH")
      ) {
        instanceCtx.get(this)!.fetchDatabaseInfo();
      } else {
        const dbState = dbCtx.get(this)!;
        dbState.fetchSchemaData();
      }
    }
  }

  @observable
  schemaId: string | null = null;
  @observable
  schemaLastMigration: string | null = null;
  @observable.ref
  schemaData: SchemaData | null = null;
  @observable
  fetchingSchemaData = false;

  @observable
  objectCount: number | null = null;

  onInit() {
    dbCtx.set(this, this);
    sessionStateCtx.set(this, this.sessionState);
    connCtx.setComputed(this, () => this.connection!);
  }

  onAttachedToRootStore() {
    const instanceState = instanceCtx.get(this)!;

    const fetchSchemaDisposer = when(
      () => this.connection !== null,
      () => this.fetchSchemaData()
    );

    const connectionDisposer = reaction(
      () => instanceState.roles?.[0],
      (currentRole) => {
        if (currentRole) {
          this._setConnection(
            instanceState.getConnection(this.name, this.sessionState)
          );
        }
      },
      {fireImmediately: true}
    );

    return () => {
      fetchSchemaDisposer();
      connectionDisposer();
    };
  }

  watchForSchemaChanges() {
    let fetchingDbInfo: Promise<void> | null = null;
    const listener = async () => {
      if (window.document.visibilityState === "visible") {
        const instanceState = instanceCtx.get(this);
        if (!instanceState || !this.schemaId || fetchingDbInfo !== null)
          return;

        fetchingDbInfo = instanceState.fetchDatabaseInfo();
        await fetchingDbInfo;
        fetchingDbInfo = null;

        const dbInfo = instanceState.databases?.find(
          (db) => db.name === this.name
        );

        if (dbInfo && dbInfo.last_migration != this.schemaLastMigration) {
          this.fetchSchemaData();
        }
      }
    };

    listener();

    window.addEventListener("visibilitychange", listener);
    window.addEventListener("focus", listener);

    return () => {
      window.removeEventListener("visibilitychange", listener);
      window.removeEventListener("focus", listener);
    };
  }

  updateObjectCount() {
    const abortController = new AbortController();
    this.connection
      ?.query(
        `select count(std::Object)`,
        undefined,
        {ignoreSessionConfig: true},
        abortController.signal
      )
      .then(({result}) => {
        if (result) {
          runInAction(() => {
            this.objectCount = Number(result[0]);
          });
        }
      })
      .catch((err) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          throw err;
        }
      });
    return () => {
      abortController.abort();
    };
  }

  @modelFlow
  fetchSchemaData = _async(function* (this: DatabaseState) {
    if (this.fetchingSchemaData || !this.connection) {
      return;
    }

    this.fetchingSchemaData = true;

    const conn = this.connection;
    const instanceState = instanceCtx.get(this)!;

    try {
      const [schemaInfo, storedSchemaData] = yield* _await(
        Promise.all([
          conn
            .query(
              `SELECT {
                migration := (SELECT (
                  SELECT schema::Migration {
                    children := .<parents[IS schema::Migration]
                  } FILTER NOT EXISTS .children
                ) {id, name}),
                version := sys::get_version(),
                versionStr := sys::get_version_as_str(),
              }`,
              undefined,
              {ignoreSessionConfig: true, blocking: true}
            )
            .then(({result}) => ({
              schemaId: `${result![0].versionStr}__${
                result![0].migration[0]?.id ?? "empty"
              }`,
              schemaMigration: result![0].migration[0]?.name ?? null,
              version: result![0].version as {
                major: number;
                minor: number;
                stage: string;
                stage_no: number;
                local: string[];
              },
            })),
          fetchSchemaData(this.name, instanceState.instanceId!),
        ])
      );

      if (this.schemaId === schemaInfo.schemaId) {
        return;
      }

      const edgedbVersion = [
        Number(schemaInfo.version.major),
        Number(schemaInfo.version.minor),
        schemaInfo.version.stage as any,
        Number(schemaInfo.version.stage_no),
      ] as EdgeDBVersion;

      let rawData: RawIntrospectionResult;
      if (
        storedSchemaData?.schemaId !== schemaInfo.schemaId ||
        storedSchemaData.version !== SCHEMA_DATA_VERSION
      ) {
        // Directly set loading tab by model name to avoid cyclic dependency
        // on Schema state class
        this.loadingTabs.set("Schema", true);
        try {
          rawData = yield* _await(
            conn
              .query(getIntrospectionQuery(edgedbVersion), undefined, {
                ignoreSessionConfig: true,
                blocking: true,
              })
              .then(({result}) => {
                return result![0] as RawIntrospectionResult;
              })
          );
        } finally {
          this.loadingTabs.set("Schema", false);
        }
        storeSchemaData(this.name, instanceState.instanceId!, {
          version: SCHEMA_DATA_VERSION,
          schemaId: schemaInfo.schemaId,
          schemaLastMigration: schemaInfo.schemaMigration,
          data: rawData,
        });
      } else {
        rawData = storedSchemaData.data;
      }

      const {
        types,
        pointers,
        functions,
        operators,
        constraints,
        annotations,
        aliases,
        globals,
        extensions,
      } = buildTypesGraph(rawData, edgedbVersion);

      const schemaData: SchemaData = {
        objects: new Map(
          [...types.values()]
            .filter((t) => t.schemaType === "Object")
            .map((t) => [t.id, t as SchemaObjectType])
        ),
        objectsByName: new Map(
          [...types.values()]
            .filter((t) => t.schemaType === "Object")
            .map((t) => [t.name, t as SchemaObjectType])
        ),
        functions,
        operators,
        constraints,
        scalars: new Map(
          [...types.values()]
            .filter((t) => t.schemaType === "Scalar")
            .map((t) => [t.name, t as SchemaScalarType])
        ),
        types,
        pointers,
        annotations,
        aliases,
        globals,
        extensions,
        shortNamesByModule: [
          ...([...types.values()].filter(
            (t) => t.schemaType === "Object" || t.schemaType === "Scalar"
          ) as (SchemaObjectType | SchemaScalarType)[]),
          ...[...pointers.values()].filter((p) => p.abstract),
          ...functions.values(),
          ...constraints.values(),
          ...annotations.values(),
          ...aliases.values(),
          ...globals.values(),
        ].reduce((modules, item) => {
          if (!modules.has(item.module)) {
            modules.set(item.module, new Set());
          }
          modules.get(item.module)!.add(item.shortName);
          return modules;
        }, new Map<string, Set<string>>()),
      };

      this.schemaId = schemaInfo.schemaId;
      this.schemaLastMigration = schemaInfo.schemaMigration;
      this.schemaData = schemaData;
    } finally {
      this.fetchingSchemaData = false;
    }
  });
}

export const DatabaseStateContext = createContext<DatabaseState>(null!);

export function useDatabaseState() {
  return useContext(DatabaseStateContext);
}
