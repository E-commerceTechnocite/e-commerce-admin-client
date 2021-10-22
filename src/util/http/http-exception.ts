export class HttpException extends Error {
  statusCode: string | number
}

export class HttpClientSideException extends HttpException {}

export class HttpServerSideException extends HttpException {}
