import { IdbCursor } from "./cursor.ts";
import type {
  IdbTransactionMode,
  IdbType,
  ReadonlyMode,
  ReadWriteMode,
  VersionChangeMode,
} from "./types.ts";
import { requestToPromise } from "./utils.ts";

export type IdbQuery = IDBValidKey | IDBKeyRange;

export abstract class IdbStore<
  out S extends IDBObjectStore | IDBIndex,
  out T,
  out Mode extends IdbTransactionMode,
> implements IdbType<IDBObjectStore | IDBIndex> {
  /** @ignore */
  constructor(protected readonly store: S) {}

  get name(): string {
    return this.store.name;
  }

  get keyPath(): string | string[] {
    return this.store.keyPath;
  }

  count(query?: IdbQuery): Promise<number> {
    return requestToPromise(this.store.count(query));
  }

  get(query: IdbQuery): Promise<T | undefined> {
    return requestToPromise(this.store.get(query));
  }

  getAll(query?: IdbQuery | null, count?: number): Promise<T[]> {
    return requestToPromise(this.store.getAll(query, count));
  }

  getAllKeys(query?: IdbQuery | null, count?: number): Promise<IDBValidKey[]> {
    return requestToPromise(this.store.getAllKeys(query, count));
  }

  getKey(query: IdbQuery): Promise<IDBValidKey | undefined> {
    return requestToPromise(this.store.getKey(query));
  }

  openCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<T, Mode> | null> {
    return IdbCursor.from(
      this.store.openCursor(query, direction) as IDBRequest<IDBCursor | null>,
    );
  }

  openKeyCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<void, Mode> | null> {
    return IdbCursor.from(this.store.openKeyCursor(query, direction));
  }
}

export class IdbObjectStore<
  out T,
  out Mode extends IdbTransactionMode = ReadonlyMode,
> extends IdbStore<IDBObjectStore, T, Mode>
  implements IdbType<Omit<IDBObjectStore, "transaction">> {
  get autoIncrement(): boolean {
    return this.store.autoIncrement;
  }

  get indexNames(): DOMStringList {
    return this.store.indexNames;
  }

  createIndex(
    this: IdbObjectStore<T, VersionChangeMode>,
    name: string,
    keyPath: string | Iterable<string>,
    options?: IDBIndexParameters,
  ): IdbIndex<T, Mode> {
    return new IdbIndex(this.store.createIndex(name, keyPath, options));
  }

  deleteIndex(this: IdbObjectStore<T, VersionChangeMode>, name: string): void {
    this.store.deleteIndex(name);
  }

  index(name: string): IdbIndex<T, Mode> {
    return new IdbIndex(this.store.index(name));
  }

  add(
    this: IdbObjectStore<T, ReadWriteMode>,
    value: T,
    key?: IDBValidKey,
  ): Promise<IDBValidKey> {
    return requestToPromise(this.store.add(value, key));
  }

  put(
    this: IdbObjectStore<T, ReadWriteMode>,
    value: T,
    key?: IDBValidKey,
  ): Promise<IDBValidKey> {
    return requestToPromise(this.store.put(value, key));
  }

  delete(
    this: IdbObjectStore<T, ReadWriteMode>,
    query: IdbQuery,
  ): Promise<void> {
    return requestToPromise(this.store.delete(query));
  }

  clear(this: IdbObjectStore<T, ReadWriteMode>): Promise<void> {
    return requestToPromise(this.store.clear());
  }
}

export class IdbIndex<out T, out Mode extends IdbTransactionMode = ReadonlyMode>
  extends IdbStore<IDBIndex, T, Mode>
  implements IdbType<Omit<IDBIndex, "objectStore">> {
  get unique(): boolean {
    return this.store.unique;
  }

  get multiEntry(): boolean {
    return this.store.multiEntry;
  }
}
