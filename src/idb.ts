import { IdbTransaction } from "./transaction.ts";
import type { IdbType } from "./types.ts";

export class Idb
  implements
    IdbType<Omit<IDBDatabase, "createObjectStore" | "deleteObjectStore">> {
  private constructor(private readonly db: IDBDatabase) {}

  get name(): string {
    return this.db.name;
  }

  get version(): number {
    return this.db.version;
  }

  get objectStoreNames(): DOMStringList {
    return this.db.objectStoreNames;
  }

  close(): void {
    this.db.close();
  }

  transaction(
    storeNames: string | Iterable<string>,
    mode?: IDBTransactionMode,
    options?: IDBTransactionOptions,
  ): IdbTransaction {
    const transaction = this.db.transaction(storeNames, mode, options);
    return new IdbTransaction(transaction);
  }
}
