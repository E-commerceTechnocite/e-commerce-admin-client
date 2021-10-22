import { EntityInterface } from '../entity.interface'
import { UserRoleModel } from './user-role.model'

export interface UserModel extends EntityInterface {
  username?: string
  email?: string
  description?: string
  role?: UserRoleModel
}
