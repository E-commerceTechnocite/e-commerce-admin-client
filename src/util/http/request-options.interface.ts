export interface RequestOptionsInterface {
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: HeadersInit
  integrity?: string
  keepalive?: boolean
  mode?: RequestMode
  redirect?: RequestRedirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  signal?: AbortSignal | null
  window?: any
}
