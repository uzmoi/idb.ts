import type { IdbCursor } from "./cursor.ts";
import type { IdbIndex, IdbObjectStore } from "./store.ts";
import type { IdbTransaction } from "./transaction.ts";

export declare namespace IdbMode {
  interface Readonly {
    readonly read: unique symbol;
  }

  interface ReadWrite extends Readonly {
    readonly write: unique symbol;
  }

  interface VersionChange extends ReadWrite {
    readonly versionchange: unique symbol;
  }
}

export type IdbTransactionMode =
  IdbTransactionModeMap[keyof IdbTransactionModeMap];

export interface IdbTransactionModeMap {
  readonly: IdbMode.Readonly;
  readwrite: IdbMode.ReadWrite;
  versionchange: IdbMode.VersionChange;
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
