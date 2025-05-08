import type { IdbCursor } from "./cursor.ts";
import type { IdbIndex, IdbObjectStore } from "./store.ts";
import type { IdbTransaction } from "./transaction.ts";

type IdbResult<T> = T extends IDBRequest<infer U>
  ? Promise<U extends undefined ? void : U extends IDBCursor ? IdbCursor : U>
  : T extends IDBTransaction ? IdbTransaction
  : T extends IDBObjectStore ? IdbObjectStore
  : T extends IDBIndex ? IdbIndex
  : T;

export type IdbType<T> = {
  [P in Exclude<keyof T, `on${string}` | keyof EventTarget>]: T[P] extends
    (...args: infer A) => infer R ? (...args: A) => IdbResult<R>
    : T[P];
};
