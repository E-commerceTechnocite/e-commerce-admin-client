import { EntityInterface } from '../entity.interface'
import { TaxRuleModel } from './tax-rule.model'

export interface CountryModel extends EntityInterface {
  name?: string
  code?: string
  taxRules?: TaxRuleModel[]
}
