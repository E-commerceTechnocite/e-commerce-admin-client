import { FileInterface } from "./file.interface";
import { ProductModel } from "../product/product.model";

export interface PictureModel extends FileInterface {
  caption?: string;
  height?: number;
  width?: number;
  products?: ProductModel[];
  productThumbnail?: ProductModel;
}
