import { EntityInterface } from '../entity.interface'

export interface CustomerModel extends EntityInterface {
  username?: string
  email?: string
  phoneNumber?: string
  firstName?: string
  lastName?: string
  gender?: string
  birthDate?: string
  description?: string
}
