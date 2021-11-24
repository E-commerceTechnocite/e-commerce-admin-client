import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { config } from '../../index'
import '../orders/OrdersList.scss'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { motion } from 'framer-motion'
import OrdersListSkeleton from './skeleton/OrdersListSkeleton'
import _ from 'lodash'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import Legend from '../legend/legend'
import { OrderModel } from '../../models/orders/order.model'

/*nterface IOrdersListProps {
  number?: number
  pagination?: boolean
}*/

const OrdersList: React.FunctionComponent<any> = () => {
  const [orders, setOrders] = useState<[]>()
  //const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [searchedValue, setSearchedValue] = useState("")
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()
  const isActive = (uri: string, exact = false): boolean => {
    return exact ? location.pathname === uri : location.pathname.startsWith(uri)
  }

  /**
   * Returns the get request of the customers list
   * @returns request
   */

  /*const ordersRequest = () => {
  if(searchedValue === "") {
    return http.get<PaginationModel<OrderModel>>(
      `${config.api}/v1/order-product${
        query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('page')}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
    } else {
      return http.get<PaginationModel<OrderModel>>(
        `${config.api}/v1/customers/search${
          query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('page')}${searchedValue ? '&q=' + searchedValue : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
    }
  }*/

  /**
   * Sends the get request of the customers list and sets customers & pagination state
   */
  /*const getOrders = async () => {
    let { data, error } = await sendRequest(ordersRequest)
    if (error) {
      /*if (error.statusCode === 400) {
        history.push('/stock')
        return
      }*/
      /*if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
   setOrders(data)
    //setMeta(data.meta)
  }*/

  /**
   * Returns the delete request for a specific customer
   * @return request
   */
  /*const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/customers/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }*/

  /**
   * Sends the delete request for a specific customer
   * @param id :string
   * @param username :string
   */
  /*const deleteCustomer = async (id: string, username: string) => {
    if (confirm(`Delete customer: ${username}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }*/

  /*const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setSearchedValue(searchValue);
    }, 500),
    []
  )*

  // Check if customer has been added and if so displays a toast
  useEffect(() => {
    if (!query.get('page')) {
      history.push('/customers?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getOrders().then()
  }, [refreshPage, query.get('page'), query.get('search'), query.get('order')])


  /*useEffect(() => {
    if(meta) {
      if(meta.currentPage === 1) {
        setRefreshPage(!refreshPage)
      }
    }
    history.push('/customers?page=1&s=u')
  }, [searchedValue])*/

  return (
    <>
      {/*{!orders && !meta && <OrdersListSkeleton />}
      {orders && meta && (*/}
        <div className="orders-buttons">
          <button
          /*onClick={() => switchTabs('group')}
          className={group ? 'action' : 'second-action'}*/
          className="action"
          >
          Pending
          </button>
          <button
          /*onClick={() => switchTabs('country')}
          className={country ? 'action' : 'second-action'}*/
          className="second-action"
          >
          Done
          </button>
        </div>
        <div className="orders">
          <div className="top-container">
            {/*<div className="process"><label>Orders in process</label></div>
            <div className="done"><label>Orders done</label></div>*/}
            
          </div>
          <div className="order-list">
            <div className="legend">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Details</span>
              <span>Amount</span>
              {/*<Legend
                uri={`/orders`}
                name={`Customer`}
                search={`username`}
              />
              <Legend 
              uri={`/orders`} name={`E-mail`} search={`email`} />
              <Legend
                uri={`/orders`}
                name={`Phone number`}
                search={`phoneNumber`}
              />
              <Legend
                uri={`/orders`}
                name={`First name`}
                search={`firstName`}
              />
              <Legend
                uri={`/orders`}
                name={`Last name`}
                search={`lastName`}
              />*/}
            </div>
            {/*
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
              
              {orders.length === 0 && <div className="notfound"><label>Customer not found</label></div>}
              {orders?.map((customer, index) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="order"
                    key={index}
                  >
                    <span><img
                        src={`https://avatars.dicebear.com/api/bottts/${customer.username}p.svg`}
                      /></span>
                    <span>{customer.username}</span>
                    <span>{customer.email}</span>
                    <span>{customer.phoneNumber}</span>
                    <span>{customer.firstName}</span>
                    <span>{customer.lastName}</span>
                  </motion.div>
                )
              })
            </motion.div>
            <Pagination meta={meta} uri={`/customers?page=`} />*/}
          </div>
        </div>
      {/*)}*/}
    </>
  )
}

export default OrdersList
