export const handleAsync = async <T>(
  promise: Promise<T | any>
): Promise<[T, Error]> => {
  let result: T = null;
  let error: Error = null;
  try {
    result = await promise;
  } catch (err) {
    error = err;
  }

  return [result, error];
};
