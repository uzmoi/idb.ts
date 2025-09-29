import { IdbCursor } from "./cursor.ts";
import type { IdbMode, IdbTransactionMode, IdbType } from "./types.ts";
import { requestToPromise } from "./utils.ts";

export type IdbQuery = IDBValidKey | IDBKeyRange;

export abstract class IdbStore<
  out S extends IDBObjectStore | IDBIndex,
  out T,
  out Mode extends IdbTransactionMode,
> implements IdbType<IDBObjectStore | IDBIndex> {
  /** @ignore */
  constructor(protected readonly _inner: S) {}

  get name(): string {
    return this._inner.name;
  }

  get keyPath(): string | string[] {
    return this._inner.keyPath;
  }

  count(query?: IdbQuery): Promise<number> {
    return requestToPromise(this._inner.count(query));
  }

  get(query: IdbQuery): Promise<T | undefined> {
    return requestToPromise(this._inner.get(query));
  }

  getAll(query?: IdbQuery | null, count?: number): Promise<T[]> {
    return requestToPromise(this._inner.getAll(query, count));
  }

  getAllKeys(query?: IdbQuery | null, count?: number): Promise<IDBValidKey[]> {
    return requestToPromise(this._inner.getAllKeys(query, count));
  }

  getKey(query: IdbQuery): Promise<IDBValidKey | undefined> {
    return requestToPromise(this._inner.getKey(query));
  }

  openCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<T, Mode> | null> {
    return IdbCursor.from(
      this._inner.openCursor(query, direction) as IDBRequest<IDBCursor | null>,
    );
  }

  openKeyCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<void, Mode> | null> {
    return IdbCursor.from(this._inner.openKeyCursor(query, direction));
  }
}

export class IdbObjectStore<
  out T,
  out Mode extends IdbTransactionMode = IdbMode.Readonly,
> extends IdbStore<IDBObjectStore, T, Mode>
  implements IdbType<Omit<IDBObjectStore, "transaction">> {
  get autoIncrement(): boolean {
    return this._inner.autoIncrement;
  }

  get indexNames(): DOMStringList {
    return this._inner.indexNames;
  }

  createIndex(
    this: IdbObjectStore<T, IdbMode.VersionChange>,
    name: string,
    keyPath: string | Iterable<string>,
    options?: IDBIndexParameters,
  ): IdbIndex<T, Mode> {
    return new IdbIndex(this._inner.createIndex(name, keyPath, options));
  }

  deleteIndex(
    this: IdbObjectStore<T, IdbMode.VersionChange>,
    name: string,
  ): void {
    this._inner.deleteIndex(name);
  }

  index(name: string): IdbIndex<T, Mode> {
    return new IdbIndex(this._inner.index(name));
  }

  add(
    this: IdbObjectStore<T, IdbMode.ReadWrite>,
    value: T,
    key?: IDBValidKey,
  ): Promise<IDBValidKey> {
    return requestToPromise(this._inner.add(value, key));
  }

  put(
    this: IdbObjectStore<T, IdbMode.ReadWrite>,
    value: T,
    key?: IDBValidKey,
  ): Promise<IDBValidKey> {
    return requestToPromise(this._inner.put(value, key));
  }

  delete(
    this: IdbObjectStore<T, IdbMode.ReadWrite>,
    query: IdbQuery,
  ): Promise<void> {
    return requestToPromise(this._inner.delete(query));
  }

  clear(this: IdbObjectStore<T, IdbMode.ReadWrite>): Promise<void> {
    return requestToPromise(this._inner.clear());
  }
}

export class IdbIndex<
  out T,
  out Mode extends IdbTransactionMode = IdbMode.Readonly,
> extends IdbStore<IDBIndex, T, Mode>
  implements IdbType<Omit<IDBIndex, "objectStore">> {
  get unique(): boolean {
    return this._inner.unique;
  }

  get multiEntry(): boolean {
    return this._inner.multiEntry;
  }
}
