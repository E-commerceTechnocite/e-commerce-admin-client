import { EntityInterface } from '../entity.interface'
import { ProductModel } from './product.model'

export interface ProductCategoryModel extends EntityInterface {
  label?: string
  products?: ProductModel[]
}
