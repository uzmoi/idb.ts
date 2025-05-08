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
  private constructor(private readonly cursor: IDBCursor) {}

  get direction(): IDBCursorDirection {
    return this.cursor.direction;
  }

  get key(): IDBValidKey {
    return this.cursor.key;
  }

  get primaryKey(): IDBValidKey {
    return this.cursor.primaryKey;
  }

  get value(): T {
    return (this.cursor as IDBCursorWithValue).value;
  }

  advance(count: number): Promise<IdbCursor<T, Mode> | null> {
    this.cursor.advance(count);
    return IdbCursor.from(this.cursor.request);
  }

  continue(key?: IDBValidKey): Promise<IdbCursor<T, Mode> | null> {
    this.cursor.continue(key);
    return IdbCursor.from(this.cursor.request);
  }

  continuePrimaryKey(
    key: IDBValidKey,
    primaryKey: IDBValidKey,
  ): Promise<IdbCursor<T, Mode> | null> {
    this.cursor.continuePrimaryKey(key, primaryKey);
    return IdbCursor.from(this.cursor.request);
  }

  update(this: IdbCursor<T, ReadWriteMode>, value: T): Promise<IDBValidKey> {
    const req = this.cursor.update(value);
    return requestToPromise(req);
  }

  delete(this: IdbCursor<T, ReadWriteMode>): Promise<void> {
    const req = this.cursor.delete();
    return requestToPromise(req);
  }
}
