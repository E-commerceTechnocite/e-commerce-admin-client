import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Loading from '../components//loading/Loading'
import Pagination from '../components/pagination/Pagination'
import { PaginationMetadataModel } from '../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../models/pagination/pagination.model'
import { ProductModel } from '../models/product/product.model'
import { config } from '../index'
import { sendRequest } from '../util/helpers/refresh'
import { http } from '../util/http'
import { htmlToText } from 'html-to-text'
import { motion } from 'framer-motion'
import Granted from './Granted'
import { auth } from '../util/helpers/auth'

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
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()

  /**
   * Returns request to get the page of the product list
   * @returns request
   */
  const pageRequest = () =>
    http.get<PaginationModel<ProductModel>>(
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

  // Check if product has been added and if so displays a toast
  useEffect(() => {
    console.log(success)
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  useEffect(() => {
    getProducts().then()
  }, [page, refreshPage])

  return (
    <>
      <div className="products">
        <div className="top-container">
          {pagination && (
            <div className="search">
              <i className="fas fa-search" />
              <input type="text" placeholder="Search..." />
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
                        <span>
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
        )}
      </div>
    </>
  )
}

export default ProductsList
