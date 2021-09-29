import { ProductCategoryModel } from "./product-category.model";
import { TaxRuleGroupModel } from "./tax-rule-group.model";
import { PictureModel } from "../files/picture.model";
import { EntityInterface } from "../entity.interface";

export interface ProductModel extends EntityInterface {
  title?: string;
  reference?: string;
  description?: string;
  price?: number;
  category?: ProductCategoryModel;
  taxRuleGroup?: TaxRuleGroupModel;
  pictures?: PictureModel[];
  thumbnail?: PictureModel;
}
