import type {
  IdbTransactionMode,
  IdbType,
  ReadonlyMode,
  ReadWriteMode,
} from "./types.ts";
import { requestToPromise } from "./utils.ts";

export class IdbCursor<
  out T,
  out Mode extends IdbTransactionMode = ReadonlyMode,
> implements IdbType<Omit<IDBCursorWithValue, "request" | "source">> {
  static async from<T, Mode extends IdbTransactionMode>(
    request: IDBRequest<IDBCursor | null>,
  ): Promise<IdbCursor<T, Mode> | null> {
    const cursor = await requestToPromise(request);
    return cursor && new IdbCursor(cursor);
  }

  /** @ignore */
  private constructor(private readonly _inner: IDBCursor) {}

  get direction(): IDBCursorDirection {
    return this._inner.direction;
  }

  get key(): IDBValidKey {
    return this._inner.key;
  }

  get primaryKey(): IDBValidKey {
    return this._inner.primaryKey;
  }

  get value(): T {
    return (this._inner as IDBCursorWithValue).value;
  }

  advance(count: number): Promise<IdbCursor<T, Mode> | null> {
    this._inner.advance(count);
    return IdbCursor.from(this._inner.request);
  }

  continue(key?: IDBValidKey): Promise<IdbCursor<T, Mode> | null> {
    this._inner.continue(key);
    return IdbCursor.from(this._inner.request);
  }

  continuePrimaryKey(
    key: IDBValidKey,
    primaryKey: IDBValidKey,
  ): Promise<IdbCursor<T, Mode> | null> {
    this._inner.continuePrimaryKey(key, primaryKey);
    return IdbCursor.from(this._inner.request);
  }

  update(this: IdbCursor<T, ReadWriteMode>, value: T): Promise<IDBValidKey> {
    return requestToPromise(this._inner.update(value));
  }

  delete(this: IdbCursor<T, ReadWriteMode>): Promise<void> {
    return requestToPromise(this._inner.delete());
  }
}
