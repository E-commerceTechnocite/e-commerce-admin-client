import * as React from "react";
import "./AddProduct.scss";
import ProductForm from "../components/product/ProductForm";

const AddProduct = () => {
  return (
    <>
      <ProductForm submitButtonContent="Add Product" />
    </>
  );
};
export default AddProduct;
