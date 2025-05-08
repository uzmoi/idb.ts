import { IdbObjectStore } from "./store.ts";
import type { IdbTransactionMode, IdbType, ReadonlyMode } from "./types.ts";

export class IdbTransaction<
  out T,
  out Mode extends IdbTransactionMode = ReadonlyMode,
> implements IdbType<Omit<IDBTransaction, "error" | "db">> {
  /** @ignore */
  constructor(private readonly tx: IDBTransaction) {}

  get mode(): IDBTransactionMode {
    return this.tx.mode;
  }

  get durability(): IDBTransactionDurability {
    return this.tx.durability;
  }

  get objectStoreNames(): DOMStringList {
    return this.tx.objectStoreNames;
  }

  abort(): void {
    this.tx.abort();
  }

  commit(): void {
    this.tx.commit();
  }

  objectStore<StoreName extends Extract<keyof T, string>>(
    name: StoreName,
  ): IdbObjectStore<T[StoreName], Mode> {
    return new IdbObjectStore(this.tx.objectStore(name));
  }
}
