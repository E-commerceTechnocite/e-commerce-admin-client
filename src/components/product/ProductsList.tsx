import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
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
import { useQuery } from '../../util/hook/useQuery'

interface IProductsListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const ProductsList: React.FunctionComponent<IProductsListProps> = ({
  number,
  pagination,
  success,
  successEdit,
}) => {
  const [products, setProducts] = useState<ProductModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [searchedValue, setSearchedValue] = useState("")
  const [toast, setToast] = useState(false)
  const [toastEdit, setToastEdit] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const query = useQuery()
  const history = useHistory()
  const [isMounted, setIsMounted] = useState(false)

  /**
   * Returns request to get the page of the product list
   * @returns request
   */
  const pageRequest = () => {
    if(searchedValue === "") {
      return http.get<PaginationModel<ProductModel>>(
        `${config.api}/v1/product?page=${pagination ? query.get('page') : '1'}${
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
        `${config.api}/v1/product/search?q=${searchedValue}&page=${pagination ? query.get('page') : '1'}${
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

  const getProducts = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
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
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setSearchedValue(searchValue);
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
    if (successEdit === true) {
      setToastEdit(true)
      setTimeout(() => {
        setToastEdit(false)
      }, 10000)
    }
  }, [success, successEdit])

  useEffect(() => {
    if (query.get('scroll')) {
    }
    if (!query.get('page')) {
      if (window.location.pathname === '/admin/products') {
        history.push('/products?page=1&s=u')
        return
      }
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getProducts().then()
    console.log(products)
  }, [refreshPage, query.get('page')])

  useEffect(() => {
    if(meta) {
      if(meta.currentPage === 1) {
        setRefreshPage(!refreshPage)
      }
    }
    history.push('/products?page=1&s=u')
  }, [searchedValue])

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
            {success && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Product Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Product Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>
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
                        to={`/products/edit/${product.id}?page=${query.get(
                          'page'
                        )}`}
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
                        onClick={() => deleteProduct(product.id, product.title)}
                      >
                        <i className="fas fa-trash" />
                      </motion.button>
                    </Granted>
                  </motion.div>
                )
              })}
            </motion.div>
            {pagination && <Pagination meta={meta} uri="/products?page=" />}
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsList
