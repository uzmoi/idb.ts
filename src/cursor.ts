import type { IdbType } from "./types.ts";
import { requestToPromise } from "./utils.ts";

export class IdbCursor<out T>
  implements IdbType<Omit<IDBCursorWithValue, "request" | "source">> {
  static async from<T>(
    request: IDBRequest<IDBCursor | null>,
  ): Promise<IdbCursor<T> | null> {
    const cursor = await requestToPromise(request);
    return cursor && new IdbCursor(cursor);
  }

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

  advance(count: number): Promise<IdbCursor<T> | null> {
    this.cursor.advance(count);
    return IdbCursor.from(this.cursor.request);
  }

  continue(key?: IDBValidKey): Promise<IdbCursor<T> | null> {
    this.cursor.continue(key);
    return IdbCursor.from(this.cursor.request);
  }

  continuePrimaryKey(
    key: IDBValidKey,
    primaryKey: IDBValidKey,
  ): Promise<IdbCursor<T> | null> {
    this.cursor.continuePrimaryKey(key, primaryKey);
    return IdbCursor.from(this.cursor.request);
  }

  update(value: T): Promise<IDBValidKey> {
    const req = this.cursor.update(value);
    return requestToPromise(req);
  }

  delete(): Promise<void> {
    const req = this.cursor.delete();
    return requestToPromise(req);
  }
}
