import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { CustomerModel } from '../../models/customers/customers.model'
import CustomersListSkeleton from './skeleton/CustomersListSkeleton'
import { requestParams } from '../../util/helpers/queries'
import { useEffect, useState, useCallback } from 'react'
import { sendRequest } from '../../util/helpers/refresh'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import { useHistory } from 'react-router'
import { http } from '../../util/http'
import { motion } from 'framer-motion'
import Legend from '../legend/legend'
import { config } from '../../index'
import * as React from 'react'
import './CustomersList.scss'
import _ from 'lodash'

const CustomersList: React.FunctionComponent = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const requestParam = requestParams()
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns the get request of the customers list
   * @returns request
   */
  const customersRequest = () => {
    const request = !query.get('q')
      ? `${config.api}/v1/customers${requestParam.getOrderBy(
          'search',
          'order'
        )}${requestParam.getPage('page')}`
      : `${config.api}/v1/customers/search${requestParam.getPage(
          'page',
          'q'
        )}${requestParam.getQ('q')}`

    return http.get<PaginationModel<CustomerModel>>(request, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Sends the get request of the customers list and sets customers & pagination state
   */
  const getCustomers = async () => {
    let { data, error } = await sendRequest(customersRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/customers')
        return
      }
      history.push('/login')
    }
    setCustomers(data.data)
    setMeta(data.meta)
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      history.push({
        pathname: '/customers',
        search: `?page=1&s=u${searchValue ? `&q=${searchValue}` : ''}`,
      })
    }, 500),
    []
  )

  // Check if customer has been added and if so displays a toast
  useEffect(() => {
    if (!query.get('page')) {
      history.push('/customers?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getCustomers().then()
  }, [
    query.get('page'),
    query.get('search'),
    query.get('order'),
    query.get('q'),
  ])

  return (
    <>
      {!customers && !meta && <CustomersListSkeleton />}
      {customers && meta && (
        <div className="customers">
          <div className="top-container">
            <div className="search">
              <i
                className="fas fa-search"
                onClick={() => debounce(query.get('q'))}
              />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => debounce(e.target.value)}
              />
            </div>
          </div>
          <div className="customer-list">
            <div className="legend">
              <span></span>
              <Legend
                uri={`/customers`}
                name={`Username`}
                search={`username`}
              />
              <Legend uri={`/customers`} name={`E-mail`} search={`email`} />
              <Legend
                uri={`/customers`}
                name={`Phone number`}
                search={`phoneNumber`}
              />
              <Legend
                uri={`/customers`}
                name={`First name`}
                search={`firstName`}
              />
              <Legend
                uri={`/customers`}
                name={`Last name`}
                search={`lastName`}
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
            >
              {customers.length === 0 && (
                <div className="notfound">
                  <label>Customer not found</label>
                </div>
              )}
              {customers?.map((customer, index) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="customer"
                    key={index}
                  >
                    <span>
                      <img
                        src={`https://avatars.dicebear.com/api/bottts/${customer.username}p.svg`}
                      />
                    </span>
                    <span>{customer.username}</span>
                    <span>{customer.email}</span>
                    <span>{customer.phoneNumber}</span>
                    <span>{customer.firstName}</span>
                    <span>{customer.lastName}</span>
                  </motion.div>
                )
              })}
            </motion.div>
            <Pagination meta={meta} uri={`/customers?page=`} />
          </div>
        </div>
      )}
    </>
  )
}

export default CustomersList
