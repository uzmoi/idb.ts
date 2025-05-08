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
    const req = this.store.count(query);
    return requestToPromise(req);
  }

  get(query: IdbQuery): Promise<T | undefined> {
    const req = this.store.get(query);
    return requestToPromise(req);
  }

  getAll(query?: IdbQuery | null, count?: number): Promise<T[]> {
    const req = this.store.getAll(query, count);
    return requestToPromise(req);
  }

  getAllKeys(query?: IdbQuery | null, count?: number): Promise<IDBValidKey[]> {
    const req = this.store.getAllKeys(query, count);
    return requestToPromise(req);
  }

  getKey(query: IdbQuery): Promise<IDBValidKey | undefined> {
    const req = this.store.getKey(query);
    return requestToPromise(req);
  }

  openCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<T, Mode> | null> {
    const req = this.store.openCursor(query, direction);
    return IdbCursor.from(req as IDBRequest<IDBCursor | null>);
  }

  openKeyCursor(
    query?: IdbQuery | null,
    direction?: IDBCursorDirection,
  ): Promise<IdbCursor<void, Mode> | null> {
    const req = this.store.openKeyCursor(query, direction);
    return IdbCursor.from(req);
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
    const req = this.store.add(value, key);
    return requestToPromise(req);
  }

  put(
    this: IdbObjectStore<T, ReadWriteMode>,
    value: T,
    key?: IDBValidKey,
  ): Promise<IDBValidKey> {
    const req = this.store.put(value, key);
    return requestToPromise(req);
  }

  delete(
    this: IdbObjectStore<T, ReadWriteMode>,
    query: IdbQuery,
  ): Promise<void> {
    const req = this.store.delete(query);
    return requestToPromise(req);
  }

  clear(this: IdbObjectStore<T, ReadWriteMode>): Promise<void> {
    const req = this.store.clear();
    return requestToPromise(req);
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
