import { EntityInterface } from "../entity.interface";
import { TaxRuleModel } from "./tax-rule.model";

export interface TaxModel extends EntityInterface {
  rate?: number;
  taxRules?: TaxRuleModel[];
}
