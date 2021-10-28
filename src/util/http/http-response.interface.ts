export class HttpResponseInterface {
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean
  readonly status: number
  readonly statusText: string
  readonly type: ResponseType
  readonly url: string
}
