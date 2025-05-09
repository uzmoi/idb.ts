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
  private constructor(private readonly _inner: IDBDatabase) {}

  get name(): string {
    return this._inner.name;
  }

  get version(): number {
    return this._inner.version;
  }

  get objectStoreNames(): DOMStringList {
    return this._inner.objectStoreNames;
  }

  close(): void {
    this._inner.close();
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
    return new IdbTransaction(
      this._inner.transaction(storeNames, mode, options),
    );
  }
}
