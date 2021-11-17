import { EntityInterface } from '../entity.interface'
import { ProductModel } from '../product/product.model';

export interface OrderModel extends EntityInterface {
  username?: string
  quantity?: number
  email?: string
  product?: ProductModel
}