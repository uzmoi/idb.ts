import type { IdbType } from "./types.ts";
import { requestToPromise } from "./utils.ts";

export class IdbCursor
  implements IdbType<Omit<IDBCursorWithValue, "request" | "source">> {
  static async from(
    request: IDBRequest<IDBCursor | null>,
  ): Promise<IdbCursor | null> {
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

  get value(): unknown {
    return (this.cursor as IDBCursorWithValue).value;
  }

  advance(count: number): Promise<IdbCursor | null> {
    this.cursor.advance(count);
    return IdbCursor.from(this.cursor.request);
  }

  continue(key?: IDBValidKey): Promise<IdbCursor | null> {
    this.cursor.continue(key);
    return IdbCursor.from(this.cursor.request);
  }

  continuePrimaryKey(
    key: IDBValidKey,
    primaryKey: IDBValidKey,
  ): Promise<IdbCursor | null> {
    this.cursor.continuePrimaryKey(key, primaryKey);
    return IdbCursor.from(this.cursor.request);
  }

  update(value: unknown): Promise<IDBValidKey> {
    const req = this.cursor.update(value);
    return requestToPromise(req);
  }

  delete(): Promise<void> {
    const req = this.cursor.delete();
    return requestToPromise(req);
  }
}
