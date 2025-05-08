export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    const ac = new AbortController();

    req.addEventListener("success", () => {
      ac.abort();
      resolve(req.result);
    }, { signal: ac.signal });

    req.addEventListener("error", () => {
      ac.abort();
      reject(req.error);
    }, { signal: ac.signal });
  });
