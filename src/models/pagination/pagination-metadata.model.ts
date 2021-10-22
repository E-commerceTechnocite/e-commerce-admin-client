export interface PaginationMetadataModel {
  readonly currentPage: number
  readonly maxPages: number
  readonly limit: number
  readonly prevPage: number
  readonly nextPage: number
  readonly count: number
}
