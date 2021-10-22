import { EntityInterface } from '../entity.interface'
import { TaxRuleModel } from './tax-rule.model'
import { ProductModel } from './product.model'

export interface TaxRuleGroupModel extends EntityInterface {
  name?: string
  taxRules?: TaxRuleModel[]
  products?: ProductModel[]
}
