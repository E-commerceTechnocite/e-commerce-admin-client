import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"
import Loading from "../components//loading/Loading"
import Pagination from "../components/pagination/Pagination"
import { PaginationMetadataModel } from "../models/pagination/pagination-metadata.model"
import { PaginationModel } from "../models/pagination/pagination.model"
import { ProductModel } from "../models/product/product.model"
import { domain } from "../util/environnement"
import { sendRequest } from "../util/helpers/refresh"
import { http } from "../util/http"

interface IProductsProps {}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
  const [products, setProducts] = useState<ProductModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const history = useHistory()
  const request = () =>
    http.get<PaginationModel<ProductModel>>(
      `${domain}/v1/product?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )

  const getProducts = async () => {
    let { data, error } = await sendRequest(request)
    if (error) {
      history.push("/login")
    }
    setProducts(data.data)
    setMeta(data.meta)
  }
  useEffect(() => {
    getProducts().then()
  }, [page])

  return (
    <div className="products">
      <div className="add-search">
        <Link to="/products/add" className="action">
          Product +
        </Link>
        <div className="search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      {!products && !meta && <Loading />}
      {products && meta && (
        <>
          <div className="product-list">
            <div className="legend">
              <div>
                <span>Title</span>
                <span>Reference</span>
                <span>Description</span>
                <span>Category</span>
                <span>Price</span>
              </div>
            </div>
            {products.map((product) => (
              <div className="product" key={product.id}>
                <div className="info ">
                  <span>{product.title}</span>
                  <span>{product.reference}</span>
                  <span>
                    {product.description.length >= 100
                      ? product.description.substr(0, 50) + "..."
                      : product.description}
                  </span>
                  <span>{product.category.label}</span>
                  <span>{product.price} €</span>
                </div>
                <div className="actions">
                  <button className="action">Edit</button>
                  <button className="delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination meta={meta} pageSetter={setPage} />
        </>
      )}
    </div>
  )
}

export default Products