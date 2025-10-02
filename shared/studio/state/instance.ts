import {createContext, useContext} from "react";
import {computed, observable, reaction, runInAction, when} from "mobx";
import {
  Model,
  model,
  modelAction,
  objectMap,
  prop,
  ModelClass,
  AnyModel,
  createContext as createMobxContext,
  ModelCreationData,
  getTypeInfo,
  ModelTypeInfo,
} from "mobx-keystone";

import {DuplicateDatabaseDefinitionError} from "gel";

import {cleanupOldSchemaDataForInstance} from "../idbStore";

import {DatabaseState} from "./database";
import {AuthProvider, Connection} from "./connection";
import {SessionState} from "./sessionState";

export const instanceCtx = createMobxContext<InstanceState>();

export async function createInstanceState(
  props: Omit<ModelCreationData<InstanceState>, "databasePageStates">,
  serverVersion: {major: number; minor: number},
  authProvider: AuthProvider
) {
  const instance = new InstanceState(props);
  instance._authProvider = authProvider;
  runInAction(() => (instance.serverVersion = serverVersion));

  await instance.fetchInstanceInfo();

  return instance;
}

export interface ServerVersion {
  major: number;
  minor: number;
}

interface DatabaseInfo {
  name: string;
  last_migration?: string | null;
}

@model("InstanceState")
export class InstanceState extends Model({
  _instanceId: prop<string | null>(null),
  isCloud: prop<boolean>(false),
  serverUrl: prop<string>(),
  serverUrlWithPort: prop<string | null>(null),

  databasePageStates: prop(() => objectMap<DatabaseState>()),
}) {
  _authProvider: AuthProvider = null!;

  @observable instanceName: string | null = null;
  @observable.ref serverVersion: ServerVersion | null = null;
  @observable.ref databases: DatabaseInfo[] | null = null;
  @observable currentRole: string | null = null;
  isSuperuser: boolean = true;
  permissions: string[] = [];

  @computed
  get userRole() {
    const user = this._authProvider.getAuthUser?.();
    return user
      ? {
          name: user,
          is_superuser: this.isSuperuser,
          permissions: this.permissions,
        }
      : null;
  }

  @computed
  get instanceId() {
    return this._instanceId ?? this.instanceName;
  }

  @computed
  get databaseNames() {
    return this.databases?.map((d) => d.name) ?? null;
  }

  defaultConnection: Connection | null = null;

  private async _sysConnFetch<T extends any>(
    query: string,
    single: true
  ): Promise<T | null>;
  private async _sysConnFetch<T extends any>(
    query: string,
    single?: false
  ): Promise<T[] | null>;
  private async _sysConnFetch(query: string, single = false) {
    const data = (await this.getConnection("__edgedbsys__").query(query))
      .result;
    return data && single ? data[0] ?? null : data;
  }

  private get databasesQuery() {
    return `sys::Database {
          name,
          ${
            !this.serverVersion || this.serverVersion?.major >= 6
              ? `last_migration,`
              : ""
          }
        }`;
  }

  async fetchInstanceInfo() {
    const data = (await this._sysConnFetch<{
      instanceName: string;
      version: ServerVersion;
      databases: DatabaseInfo[];
      currentRole: string;
      isSuperuser: boolean;
      permissions: string[];
    }>(
      `
      select {
        instanceName := sys::get_instance_name(),
        version := sys::get_version(),
        databases := ${this.databasesQuery},
        currentRole := global sys::current_role,
        isSuperuser := global sys::perm::superuser,
        permissions := global sys::current_permissions,
      }`,
      true
    ))!;

    runInAction(() => {
      this.instanceName = data.instanceName ?? "_localdev";
      this.serverVersion = data.version;
      this.databases = data.databases;
      this.currentRole = data.currentRole;
      this.isSuperuser = data.isSuperuser;
      this.permissions = data.permissions;
    });

    cleanupOldSchemaDataForInstance(this.instanceId!, this.databaseNames!);
  }

  async fetchDatabaseInfo() {
    const data = await this._sysConnFetch<DatabaseInfo>(
      `select ${this.databasesQuery}`
    );

    runInAction(() => {
      this.databases = data;
    });

    cleanupOldSchemaDataForInstance(this.instanceId!, this.databaseNames!);
  }

  onInit() {
    instanceCtx.set(this, this);

    when(
      () =>
        this.defaultConnection === null && (this.databases?.length ?? 0) > 0,
      () => {
        this.defaultConnection = this.getConnection(this.databases![0].name);
      }
    );

    return reaction(
      () => [this.serverUrl, this.currentRole, this.serverVersion],
      () => (this._connections = new Map())
    );
  }

  @observable.ref _connections = new Map<string, Connection>();
  getConnection(dbName: string, sessionState: SessionState | null = null) {
    let conn = this._connections.get(dbName);
    if (!conn || sessionState) {
      conn = new Connection(
        {
          serverUrl: this.serverUrl,
          database: dbName,
          authProvider: {
            ...this._authProvider,
            getAuthUser: () =>
              this._authProvider.getAuthUser?.() ??
              this.currentRole ??
              "edgedb",
            getUserRole: () => this.userRole,
          },
        },
        this.serverVersion,
        sessionState
      );
      if (!sessionState) {
        this._connections.set(dbName, conn);
      }
    }
    return conn;
  }

  @modelAction
  getDatabasePageState(
    databaseName: string,
    tabs: {path: string; state?: ModelClass<AnyModel>}[]
  ) {
    let dbState = this.databasePageStates.get(databaseName);
    if (!dbState) {
      dbState = new DatabaseState({
        name: databaseName,
        tabStates: objectMap(
          tabs
            .filter((t) => t.state)
            .map((t) => {
              const state = new t.state!({});
              return [state.$modelType, state];
            })
        ),
      });
      this.databasePageStates.set(databaseName, dbState);
    } else {
      for (const tab of tabs) {
        if (!tab.state) continue;
        const modelType = (getTypeInfo(tab.state) as ModelTypeInfo).modelType;
        if (!dbState.tabStates.has(modelType)) {
          const state = new tab.state({});
          dbState.tabStates.set(state.$modelType, state);
        }
      }
    }
    return dbState;
  }

  @observable creatingExampleDB = false;

  async createExampleDatabase(exampleSchema: Promise<string>) {
    runInAction(() => (this.creatingExampleDB = true));
    try {
      const schemaScript = await exampleSchema;
      try {
        await this.defaultConnection!.execute(`create database _example`);
        const exampleConn = this.getConnection("_example");
        await exampleConn.execute(schemaScript);
      } catch (err) {
        if (!(err instanceof DuplicateDatabaseDefinitionError)) {
          throw err;
        }
      }
      await this.fetchDatabaseInfo();
    } finally {
      runInAction(() => (this.creatingExampleDB = false));
    }
  }
}

export const InstanceStateContext = createContext<
  InstanceState | Error | null
>(null);

export function useInstanceState(): InstanceState {
  const ctx = useContext(InstanceStateContext);
  if (!ctx || ctx instanceof Error) {
    throw new Error("No instance ctx");
  }
  return ctx;
}

export function useFullInstanceState() {
  return useContext(InstanceStateContext);
}
