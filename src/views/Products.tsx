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
import { htmlToText } from "html-to-text"

interface IProductsProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
  const [products, setProducts] = useState<ProductModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const history = useHistory()

  // Request to get the page of the product list
  const pageRequest = () =>
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
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      history.push("/login")
    }
    setProducts(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id) => {
    console.log(id)
    return http.delete(`${domain}/v1/product/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const deleteProduct = async (id: string) => {
    console.log(sessionStorage.getItem("token"))
    let { error } = await sendRequest(deleteRequest, id)
    if (error) {
      console.log(error.message)
      // history.push("/login")
    }
  }

  // Check if product has been added and if so displays a toast
  useEffect(() => {
    if (props.location.state !== undefined) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [])

  useEffect(() => {
    getProducts().then()
  }, [page])

  return (
    <div className="products">
      <div className="top-container">
        <div className="search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <Link to="/products/add" className="action">
          New Product
        </Link>
        <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
          {" "}
          <i className="fas fa-check" />
          Product Added
          <i className="fas fa-times" onClick={() => setToast(false)} />
        </div>
      </div>
      {!products && !meta && <Loading />}
      {products && meta && (
        <>
          <div className="product-list">
            <div className="legend">
              <span>Image</span>
              <span>Title</span>
              <span>Reference</span>
              <span>Description</span>
              <span>Category</span>
              <span>Price</span>
            </div>
            {products.map((product) => {
              console.log(product.id)
              var strippedHtml = htmlToText(product.description)
              return (
                <div className="product" key={product.id}>
                  {product.thumbnail && product.thumbnail.uri && (
                    <span>
                      <img
                        src={domain + product.thumbnail.uri}
                        alt={product.thumbnail.title}
                      />
                    </span>
                  )}
                  {!product.thumbnail && (
                    <span>
                      <img />
                    </span>
                  )}
                  <span>{product.title}</span>
                  <span>{product.reference}</span>
                  <span>
                    {strippedHtml.length >= 100
                      ? strippedHtml.substr(0, 50) + "..."
                      : strippedHtml}
                  </span>
                  <span>{product.category.label}</span>
                  <span>{product.price} €</span>
                  <button className="action">Edit</button>
                  <button
                    className="delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )
            })}
            <Pagination meta={meta} pageSetter={setPage} />
          </div>
        </>
      )}
    </div>
  )
}

export default Products
