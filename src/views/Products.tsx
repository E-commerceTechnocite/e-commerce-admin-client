import * as React from "react";
import Pagination from "../components/pagination/Pagination";
import { useEffect, useState } from "react";
import { http } from "../util/http";
import { PaginationModel } from "../models/pagination/pagination.model";
import { ProductModel } from "../models/product/product.model";
import { PaginationMetadataModel } from "../models/pagination/pagination-metadata.model";

interface IProductsProps {}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [meta, setMeta] = useState<PaginationMetadataModel>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const options = {
      headers: { Authorization: `Bearer ${token}` },
    };

    http
      .get<PaginationModel<ProductModel>>(
        `http://localhost:3000/v1/product?page=${page}`,
        options
      )
      .then(({ data, error }) => {
        setProducts(data.data);
        setMeta(data.meta);
      });
  }, [page]);

  return (
    <>
      {meta && <Pagination meta={meta} pageSetter={setPage} />}
      {products.map((product) => (
        <>
          <div>{product.title}</div>
        </>
      ))}
      {meta && <Pagination meta={meta} pageSetter={setPage} />}
    </>
  );
};

export default Products;
