import { EntityInterface } from '../entity.interface'
import { TaxRuleGroupModel } from './tax-rule-group.model'
import { TaxModel } from './tax.model'
import { CountryModel } from './country.model'

export interface TaxRuleModel extends EntityInterface {
  taxRuleGroup?: TaxRuleGroupModel
  tax?: TaxModel
  country?: CountryModel
  zipCode?: string
  behavior?: number
  description?: string
}
