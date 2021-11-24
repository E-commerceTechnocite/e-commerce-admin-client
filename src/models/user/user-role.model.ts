import { EntityInterface } from '../entity.interface'

export interface UserRoleModel extends EntityInterface {
  id?: string
  name?: string
  superAdmin?: boolean,
}
