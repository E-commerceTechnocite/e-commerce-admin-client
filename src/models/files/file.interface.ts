import { EntityInterface } from "../entity.interface";

export interface FileInterface extends EntityInterface {
  title?: string;
  uri?: string;
}
