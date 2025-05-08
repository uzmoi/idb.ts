import { IdbObjectStore } from "./store.ts";
import type { IdbType } from "./types.ts";

export class IdbTransaction<out T>
  implements IdbType<Omit<IDBTransaction, "error" | "db">> {
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
  ): IdbObjectStore<T[StoreName]> {
    return new IdbObjectStore(this.tx.objectStore(name));
  }
}
