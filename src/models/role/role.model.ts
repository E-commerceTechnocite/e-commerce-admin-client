import { EntityInterface } from '../entity.interface'

export interface RoleModel extends EntityInterface {
  name?: string
  permissions?: string[]
}
