import { IdbObjectStore } from "./store.ts";
import type { IdbMode, IdbTransactionMode, IdbType } from "./types.ts";

export class IdbTransaction<
  out T,
  out Mode extends IdbTransactionMode = IdbMode.Readonly,
> implements IdbType<Omit<IDBTransaction, "error" | "db">> {
  /** @ignore */
  constructor(private readonly _inner: IDBTransaction) {}

  get mode(): IDBTransactionMode {
    return this._inner.mode;
  }

  get durability(): IDBTransactionDurability {
    return this._inner.durability;
  }

  get objectStoreNames(): DOMStringList {
    return this._inner.objectStoreNames;
  }

  abort(): void {
    this._inner.abort();
  }

  commit(): void {
    this._inner.commit();
  }

  objectStore<StoreName extends Extract<keyof T, string>>(
    name: StoreName,
  ): IdbObjectStore<T[StoreName], Mode> {
    return new IdbObjectStore(this._inner.objectStore(name));
  }
}
