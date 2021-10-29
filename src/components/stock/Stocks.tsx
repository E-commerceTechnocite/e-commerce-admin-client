import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { ProductModel } from '../../models/product/product.model'
import { http } from '../../util/http'
import { config } from '../../index'
import Granted from '../Granted'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import './Stocks.scss'
import { sendRequest } from '../../util/helpers/refresh'
import { PaginationModel } from '../../models/pagination/pagination.model'

interface IStocksProps {
  success?: boolean | undefined
}

const Stocks: React.FunctionComponent<IStocksProps> = ({ success }) => {
  const [page, setPage] = useState<number>(1)
  const [stock, setStock] = useState<ProductModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState<boolean>(false)
  const history = useHistory()

  /**
   * Returns the get request for Products (Stocks)
   * @returns request
   */
  const stocksRequest = () => {
    return http.get<PaginationModel<ProductModel>>(
      `${config.api}/v1/product?page=${page}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Submits the get request for Products (Stocks) and sets the state values from response
   */
  const submitStocks = async () => {
    let { data, error } = await sendRequest(stocksRequest)
    if (error) {
      history.push('/login')
    }
    setStock(data.data)
    setMeta(data.meta)
  }

  useEffect(() => {
    submitStocks().then()
  }, [page])

  // Check if a has been added and sends a confirmation toast
  useEffect(() => {
    if (success === true) {
      console.log(success)
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  return (
    <>
      {stock && meta && (
        <>
          <div className="stocks">
            <div className="top">
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Stock Edited
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            </div>
            {stock && meta && (
              <>
                <div className="stocks-list">
                  <div className="legend">
                    <span>Image</span>
                    <span>Product</span>
                    <span>Physical</span>
                    <span>Incoming</span>
                    <span>Pending</span>
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
                          <Link
                            to={`/stock/edit-stock/${stock.id}`}
                            className="action edit"
                          >
                            Edit
                          </Link>
                        </Granted>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <Pagination meta={meta} pageSetter={setPage} />
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Stocks
