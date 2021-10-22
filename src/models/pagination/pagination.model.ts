import { PaginationMetadataModel } from './pagination-metadata.model'

export interface PaginationModel<T> {
  readonly data: T[]
  readonly meta: PaginationMetadataModel
}
