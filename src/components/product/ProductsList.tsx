import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Loading from '../loading/Loading'
import Pagination from '../pagination/Pagination'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { ProductModel } from '../../models/product/product.model'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { htmlToText } from 'html-to-text'
import { motion } from 'framer-motion'
import Granted from '../Granted'
import { auth } from '../../util/helpers/auth'
import './ProductsList.scss'
import ProductsListSkeleton from './skeleton/ProductsListSkeleton'
import _ from 'lodash';

interface IProductsListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const ProductsList: React.FunctionComponent<IProductsListProps> = ({
  number,
  pagination,
  success,
}) => {
  const [products, setProducts] = useState<ProductModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [debouncedState, setDebouncedState] = useState("");
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()

  /**
   * Returns request to get the page of the product list
   * @returns request
   */
  const pageRequest = () => {
    if(debouncedState === "") {
      return http.get<PaginationModel<ProductModel>>(
        `${config.api}/v1/product?page=${page}${
          number ? '&limit=' + number : ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...auth.headers,
          },
        }
      )
    } else {
      return http.get<PaginationModel<ProductModel>>(
        `${config.api}/v1/product/search?q=${debouncedState}?page=${page}${
          number ? '&limit=' + number : ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...auth.headers,
          },
        }
      )
    }
  }
  /**
   * Submits to get the page of the product list
   */
  const getProducts = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      history.push('/login')
    }
    setProducts(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request of selected product
   * @param id
   * @returns request
   */
  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/product/${id}`, null, {
      headers: { ...auth.headers },
    })
  }
  /**
   * Submits delete request of selected product
   * @param id
   * @param title
   */
  const deleteProduct = async (id: string, title: string) => {
    if (confirm(`Delete product: ${title}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        console.log(error.message)
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setDebouncedState(searchValue);
    }, 500),
    []
  );

  // Check if product has been added and if so displays a toast
  useEffect(() => {
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  useEffect(() => {
    getProducts().then()
  }, [page, refreshPage, debouncedState])

  return (
    <>
      {!products && !meta && (
        <ProductsListSkeleton number={number} pagination={pagination} />
      )}
      {products && meta && (
        <div className="products">
          <div className="top-container">
            {pagination && (
              <div className="search">
                <i className="fas fa-search" />
                <input type="text" placeholder="Search..." onChange={(e) => debounce(e.target.value)}/>
              </div>
            )}
            <Granted permissions={['c:product']}>
              <Link to="/products/add" className="action">
                New Product
              </Link>
            </Granted>
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Product Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
            </div>
          </div>

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
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.01,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {products.length === 0 && <div className="notfound"><label>Product not found</label></div>}
                {products.map((product) => {
                  const strippedHtml = htmlToText(product.description)
                  return (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className="product"
                      key={product.id}
                    >
                      {product.thumbnail && product.thumbnail.uri && (
                        <span>
                          <img
                            src={config.api + product.thumbnail.uri}
                            alt={product.thumbnail.title}
                          />
                        </span>
                      )}
                      {!product.thumbnail && (
                        <span className="placeholder">
                          <img />
                        </span>
                      )}
                      <span>{product.title}</span>
                      <span>{product.reference}</span>
                      <span>
                        {strippedHtml.length >= 100
                          ? strippedHtml.substr(0, 50) + '...'
                          : strippedHtml}
                      </span>
                      <span>{product.category.label}</span>
                      <span>{product.price} €</span>

                      <Granted permissions={['u:product']}>
                        <Link
                          to={`/products/edit/${product.id}`}
                          className="action"
                        >
                          Edit
                        </Link>
                      </Granted>
                      <Granted permissions={['d:product']}>
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                          }}
                          className="delete"
                          onClick={() =>
                            deleteProduct(product.id, product.title)
                          }
                        >
                          <i className="fas fa-trash" />
                        </motion.button>
                      </Granted>
                    </motion.div>
                  )
                })}
              </motion.div>
              {pagination && <Pagination meta={meta} pageSetter={setPage} />}
            </div>
          </>
        </div>
      )}
    </>
  )
}

export default ProductsList
