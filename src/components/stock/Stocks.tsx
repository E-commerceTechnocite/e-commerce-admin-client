import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { stockSchema } from '../../util/validation/productValidation'
import { ProductModel } from '../../models/product/product.model'
import { sendRequest } from '../../util/helpers/refresh'
import { useCallback, useEffect, useState } from 'react'
import StocksSkeleton from './skeleton/StocksSkeleton'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import NumberInput from '../inputs/NumberInput'
import { auth } from '../../util/helpers/auth'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { http } from '../../util/http'
import Legend from '../legend/legend'
import { config } from '../../index'
import Granted from '../Granted'
import { Formik } from 'formik'
import * as React from 'react'
import './Stocks.scss'
import _ from 'lodash'
import Uri from '../../util/helpers/Uri'

interface stock {
  stock?: {
    physical?: number
    incoming?: number
    pending?: number
  }
}

const Stocks: React.FunctionComponent = () => {
  const [submitEdit, setSubmitEdit] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [searchStock, setSearchStock] = useState<string>()
  const [editArray, setEditArray] = useState<string[]>([])
  const [stock, setStock] = useState<ProductModel[]>()
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns the get request for Products (Stocks)
   * @returns request
   */
  const stocksRequest = () => {
    const url = !query.get('q')
      ? new Uri('/v1/product')
      : new Uri('/v1/product/search')
    url
      .setQuery('page', query.get('page') ? query.get('page') : '1')
      .setQuery('orderBy', query.get('search'))
      .setQuery('order', query.get('order'))
      .setQuery('q', query.get('q'))

    return http.get<PaginationModel<ProductModel>>(url.href, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }
  /**
   * Submits the get request for Products (Stocks) and sets the state values from response
   */
  const submitStocks = async () => {
    let { data, error } = await sendRequest(stocksRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/stock')
        return
      }
      history.push('/login')
    }
    setStock(data.data)
    setMeta(data.meta)
  }

  /**
   * Opens edit for seleted stock
   * @param id
   */
  const setEditing = (id: string) => {
    if (!editArray.includes(id)) {
      setEditArray((array) => [...array, id])
    }
  }

  /**
   * Returns  patch request for Stock product
   * @param data
   * @returns request
   */
  const stockPatchRequest = (data: stock, id: string) => {
    return http.patch(`${config.api}/v1/product/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }
  /**
   * Submits the post request for new Stock product
   * @param data
   */
  const submitStockPatch = async (data: stock, id: string) => {
    let { error } = await sendRequest(stockPatchRequest, data, id)
    if (error) {
      history.push('/login')
    }
    setSubmitEdit(!submitEdit)
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setSearchStock(searchValue)
      history.push({
        pathname: '/stock',
        search: `?page=1&s=u${searchValue ? `&q=${searchValue}` : ''}`,
      })
    }, 500),
    []
  )

  useEffect(() => {
    if (!query.get('page')) {
      history.push('/stock?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    submitStocks().then()
  }, [
    submitEdit,
    query.get('page'),
    query.get('search'),
    query.get('order'),
    query.get('q'),
  ])

  return (
    <>
      {!stock && !meta && <StocksSkeleton />}
      {stock && meta && (
        <>
          <div className="stocks">
            <div className="top">
              <div className="search">
                <i
                  className="fas fa-search"
                  onClick={() => debounce(searchStock)}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => debounce(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' ? debounce(e.currentTarget.value) : ''
                  }
                />
              </div>
            </div>
            {stock && meta && (
              <>
                <div className="stocks-list">
                  <div className="legend">
                    <span>Image</span>
                    <Legend uri={`/stock`} name={`Product`} search={`title`} />
                    <Legend
                      uri={`/stock`}
                      name={`Physical`}
                      search={`stock.physical`}
                    />
                    <Legend
                      uri={`/stock`}
                      name={`Incoming`}
                      search={`stock.incoming`}
                    />
                    <Legend
                      uri={`/stock`}
                      name={`Pending`}
                      search={`stock.pending`}
                    />
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
                    className="content"
                  >
                    {stock.length === 0 && (
                      <div className="notfound">
                        <label>Stock not found</label>
                      </div>
                    )}
                    {stock.map((stock, index) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1 },
                        }}
                        className="item"
                        key={index}
                      >
                        {stock.thumbnail && stock.thumbnail.uri && (
                          <span>
                            <img
                              src={config.api + stock.thumbnail.uri}
                              alt={stock.thumbnail.title}
                            />
                          </span>
                        )}
                        {!stock.thumbnail && (
                          <span className="placeholder">
                            <img />
                          </span>
                        )}
                        <span>{stock.title}</span>
                        {!editArray.includes(stock.id) && (
                          <>
                            {stock.stock && stock.stock.physical ? (
                              <span>{stock.stock.physical}</span>
                            ) : (
                              <span>0</span>
                            )}
                            {stock.stock && stock.stock.incoming ? (
                              <span>{stock.stock.incoming}</span>
                            ) : (
                              <span>0</span>
                            )}
                            {stock.stock && stock.stock.pending ? (
                              <span>{stock.stock.pending}</span>
                            ) : (
                              <span>0</span>
                            )}
                            <Granted permissions={['u:product']}>
                              <button
                                type="button"
                                className="action edit"
                                onClick={() => setEditing(stock.id)}
                              >
                                Edit
                              </button>
                            </Granted>
                          </>
                        )}
                        {editArray.includes(stock.id) && (
                          <>
                            <Formik
                              enableReinitialize
                              initialValues={{
                                stock: {
                                  physical: stock.stock.physical,
                                  incoming: stock.stock.incoming,
                                  pending: stock.stock.pending,
                                },
                              }}
                              validationSchema={stockSchema}
                              onSubmit={(data) => {
                                submitStockPatch(data, stock.id)
                                const array = [...editArray]
                                array.splice(editArray.indexOf(stock.id), 1)
                                setEditArray(array)
                              }}
                            >
                              {({ handleSubmit }) => {
                                return (
                                  <form onSubmit={handleSubmit}>
                                    <NumberInput name={'stock.physical'} />
                                    <NumberInput name={'stock.incoming'} />
                                    <NumberInput name={'stock.pending'} />
                                    <Granted permissions={['u:product']}>
                                      <button
                                        className="action edit"
                                        onClick={() => setEditing(stock.id)}
                                      >
                                        Submit
                                      </button>
                                    </Granted>
                                  </form>
                                )
                              }}
                            </Formik>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <Pagination meta={meta} uri={`/stock?page=`} />
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Stocks
