import { RequestOptionsInterface } from "./request-options.interface";
import { HttpException } from "./http-exception";

export interface HttpReturnValue<T> {
  data: T;
  error: HttpException;
}

export interface HttpClientInterface {
  /**
   * @param {string} url
   * @param {RequestOptionsInterface} options
   */
  get: <T>(
    url: string,
    options?: RequestOptionsInterface
  ) => Promise<HttpReturnValue<T>>;

  /**
   * @param {string} url
   * @param {BodyInit | any | null} body
   * @param {RequestOptionsInterface} options
   */
  post: <T>(
    url: string,
    body?: BodyInit | any | null,
    options?: RequestOptionsInterface
  ) => Promise<HttpReturnValue<T>>;

  /**
   * @param {string} url
   * @param {BodyInit | any | null} body
   * @param {RequestOptionsInterface} options
   */
  put: <T>(
    url: string,
    body?: BodyInit | any | null,
    options?: RequestOptionsInterface
  ) => Promise<HttpReturnValue<T>>;

  /**
   * @param {string} url
   * @param {BodyInit | any | null} body
   * @param {RequestOptionsInterface} options
   */
  patch: <T>(
    url: string,
    body?: BodyInit | any | null,
    options?: RequestOptionsInterface
  ) => Promise<HttpReturnValue<T>>;

  /**
   * @param {string} url
   * @param {BodyInit | any | null} body
   * @param {RequestOptionsInterface} options
   */
  delete: <T>(
    url: string,
    body?: BodyInit | any | null,
    options?: RequestOptionsInterface
  ) => Promise<HttpReturnValue<T>>;
}
