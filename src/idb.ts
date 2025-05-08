import type { NormalizeObject } from "@uzmoi/ut/types";
import { IdbTransaction } from "./transaction.ts";
import type { IdbTransactionModeMap, IdbType } from "./types.ts";
import { requestToPromise } from "./utils.ts";

export class Idb<out T>
  implements
    IdbType<Omit<IDBDatabase, "createObjectStore" | "deleteObjectStore">> {
  static async open<T>(name: string, version: number): Promise<Idb<T>> {
    const req = indexedDB.open(name, version);
    return new Idb(await requestToPromise(req));
  }

  static async delete(name: string): Promise<void> {
    const req = indexedDB.deleteDatabase(name);
    await requestToPromise(req);
  }

  /** @ignore */
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

  transaction<
    StoreName extends Extract<keyof T, string>,
    Mode extends Exclude<IDBTransactionMode, "versionchange"> = "readonly",
  >(
    storeNames: StoreName | Iterable<StoreName>,
    mode?: Mode,
    options?: IDBTransactionOptions,
  ): IdbTransaction<
    NormalizeObject<Pick<T, StoreName>>,
    IdbTransactionModeMap[Mode]
  > {
    const transaction = this.db.transaction(storeNames, mode, options);
    return new IdbTransaction(transaction);
  }
}
