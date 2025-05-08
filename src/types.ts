import type { IdbCursor } from "./cursor.ts";
import type { IdbIndex, IdbObjectStore } from "./store.ts";
import type { IdbTransaction } from "./transaction.ts";

export interface ReadonlyMode {
  readonly read: unique symbol;
}

export interface ReadWriteMode extends ReadonlyMode {
  readonly write: unique symbol;
}

export interface VersionChangeMode extends ReadWriteMode {
  readonly versionchange: unique symbol;
}

export type IdbTransactionMode =
  IdbTransactionModeMap[keyof IdbTransactionModeMap];

export interface IdbTransactionModeMap {
  readonly: ReadonlyMode;
  readwrite: ReadWriteMode;
  versionchange: VersionChangeMode;
}

type IdbResult<T> = T extends IDBRequest<infer U> ? Promise<
    U extends undefined ? void : U extends IDBCursor ? IdbCursor<unknown> : U
  >
  : T extends IDBTransaction ? IdbTransaction<unknown>
  : T extends IDBObjectStore ? IdbObjectStore<unknown>
  : T extends IDBIndex ? IdbIndex<unknown>
  : T;

export type IdbType<T> = {
  [P in Exclude<keyof T, `on${string}` | keyof EventTarget>]: T[P] extends
    (...args: infer A) => infer R ? {
      bivarianceHack(...args: A): IdbResult<R>;
    }["bivarianceHack"]
    : T[P];
};
