import { country } from "./country.model"
import { TaxRuleGroup } from "./taxRuleGroup.model"
import { tax } from "./tax.model"
import { PaginationModel } from "../pagination/pagination.model"

export interface TaxRuleModel {
    id?: string
    createdAt?: string
    updatedAt?: string
    deletedAt?: string
    zipCode?: string
    behavior?: number
    description?: string
    tax?: tax
    taxRuleGroup?: TaxRuleGroup
    country?: country
}
