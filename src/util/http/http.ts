import { HttpClientInterface } from "./http-client.interface";
import { handleAsync } from "../async/handle-async";
import { RequestOptionsInterface } from "./request-options.interface";

const sendRequest = async (
  url: string,
  options: RequestOptionsInterface,
  override: RequestInit
) => {
  if (override.body instanceof Object && !(override.body instanceof FormData)) {
    override.body = JSON.stringify(override.body);
  }
  const [response, error] = await handleAsync<Response>(
    fetch(url, { ...options, ...override })
  );
  if (error) throw error;
  return await response.json();
};

export const http: HttpClientInterface = {
  async delete<T>(
    url: string,
    body?: BodyInit,
    options?: RequestOptionsInterface
  ): Promise<T | any> {
    return await sendRequest(url, options, { method: "DELETE", body });
  },

  async get<T>(
    url: string,
    options?: RequestOptionsInterface
  ): Promise<T | any> {
    return await sendRequest(url, options, { method: "GET" });
  },

  async patch<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<T | any> {
    return await sendRequest(url, options, { method: "PATCH", body });
  },

  async post<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<T | any> {
    return await sendRequest(url, options, { method: "POST", body });
  },

  async put<T>(
    url: string,
    body?: BodyInit | null,
    options?: RequestOptionsInterface | undefined
  ): Promise<T | any> {
    return await sendRequest(url, options, { method: "PUT", body });
  },
};
