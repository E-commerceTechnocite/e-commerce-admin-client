import { HttpClientInterface, HttpReturnValue } from "./http-client.interface";
import { handleAsync } from "../async/handle-async";
import { RequestOptionsInterface } from "./request-options.interface";
import {
  HttpClientSideException,
  HttpException,
  HttpServerSideException,
} from "./http-exception";
import { HttpResponseInterface } from "./http-response.interface";

const sendRequest = async <T>(
  url: string,
  options: RequestOptionsInterface,
  override: RequestInit
): Promise<HttpReturnValue<T>> => {
  if (override.body instanceof Object && !(override.body instanceof FormData)) {
    override.body = JSON.stringify(override.body);
  }
  const [res, err] = await handleAsync<Response>(
    fetch(url, { ...options, ...override })
  );

  let exception: HttpException = null;
  if (res.status >= 400 && res.status < 500) {
    exception = new HttpClientSideException(
      `Error ${res.status} ${res.statusText}`
    );
  } else if (res.status >= 500) {
    exception = new HttpServerSideException(
      `Error ${res.status} ${res.statusText}`
    );
  }
  if (exception) {
    exception.statusCode = res.status;
  }
  if (err) throw err;
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = null
  }
  const error: HttpException = exception;
  const {
    ok,
    status,
    statusText,
    url: responseUrl,
    headers,
    redirected,
    type,
  } = res;
  const response: HttpResponseInterface = {
    ok,
    status,
    statusText,
    url: responseUrl,
    headers,
    redirected,
    type,
  };
  return { data, error, response };
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
