import { HttpClientInterface, HttpReturnValue } from "./http-client.interface";
import { handleAsync } from "../async/handle-async";
import { RequestOptionsInterface } from "./request-options.interface";
import {
  HttpClientSideException,
  HttpException,
  HttpServerSideException,
} from "./http-exception";

const sendRequest = async <T>(
  url: string,
  options: RequestOptionsInterface,
  override: RequestInit
): Promise<HttpReturnValue<T>> => {
  if (override.body instanceof Object && !(override.body instanceof FormData)) {
    override.body = JSON.stringify(override.body);
  }
  const [response, err] = await handleAsync<Response>(
    fetch(url, { ...options, ...override })
  );

  let exception: HttpException = null;
  if (response.status >= 400 && response.status < 500) {
    exception = new HttpClientSideException(
      `Error ${response.status} ${response.statusText}`
    );
  } else if (response.status >= 500) {
    exception = new HttpServerSideException(
      `Error ${response.status} ${response.statusText}`
    );
  }
  if (exception) {
    exception.statusCode = response.status;
  }
  if (err) throw err;
  const data = await response.json();
  const error: HttpException = exception;
  return { data, error };
};

export const http: HttpClientInterface = {
  async delete<T>(
    url: string,
    body?: BodyInit,
    options?: RequestOptionsInterface
  ): Promise<HttpReturnValue<T>> {
    return await sendRequest(url, options, { method: "DELETE", body });
  },

  async get<T>(
    url: string,
    options?: RequestOptionsInterface
  ): Promise<HttpReturnValue<T>> {
    return await sendRequest(url, options, { method: "GET" });
  },

  async patch<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<HttpReturnValue<T>> {
    return await sendRequest(url, options, { method: "PATCH", body });
  },

  async post<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<HttpReturnValue<T>> {
    return await sendRequest(url, options, { method: "POST", body });
  },

  async put<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<HttpReturnValue<T>> {
    return await sendRequest(url, options, { method: "PUT", body });
  },
};
