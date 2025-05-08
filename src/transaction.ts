import { IdbObjectStore } from "./store.ts";
import type { IdbType } from "./types.ts";

export class IdbTransaction
  implements IdbType<Omit<IDBTransaction, "error" | "db">> {
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

  objectStore(name: string): IdbObjectStore {
    return new IdbObjectStore(this.tx.objectStore(name));
  }
}
