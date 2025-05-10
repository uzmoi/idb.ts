export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    const success = () => {
      resolve(req.result);
      remove();
    };

    const error = () => {
      reject(req.error);
      remove();
    };

    const remove = () => {
      req.removeEventListener("success", success);
      req.removeEventListener("error", error);
    };
    req.addEventListener("success", success);
    req.addEventListener("error", error);
  });
