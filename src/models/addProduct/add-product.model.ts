import { PaginationMetadataModel } from '../pagination/pagination-metadata.model'

export interface GroupData {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  name?: string
  label?: string
  description?: string
  behavior?: number
  zipCode?: string
}

export interface TaxRuleGroup {
  meta: PaginationMetadataModel
  data: GroupData[]
}

export interface CategoryOptions {
  meta: PaginationMetadataModel
  data: GroupData[]
}
