import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { CustomerModel } from '../../models/customers/customers.model'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { config } from '../../index'
import './CustomersList.scss'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import Granted from '../Granted'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CustomersListSkeleton from './skeleton/CustomersListSkeleton'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'

interface ICustomersListProps {
  number?: number
  pagination?: boolean
}

const CustomersList: React.FunctionComponent<ICustomersListProps> = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns the get request of the customers list
   * @returns request
   */
  const customersRequest = () =>
    http.get<PaginationModel<CustomerModel>>(
      `${config.api}/v1/customers?page=${query.get('page')}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )

  /**
   * Sends the get request of the customers list and sets customers & pagination state
   */
  const getCustomers = async () => {
    let { data, error } = await sendRequest(customersRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
    setCustomers(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns the delete request for a specific customer
   * @return request
   */
  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/customers/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }

  /**
   * Sends the delete request for a specific customer
   * @param id :string
   * @param username :string
   */
  const deleteCustomer = async (id: string, username: string) => {
    if (confirm(`Delete customer: ${username}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }

  useEffect(() => {
    if (!query.get('page')) {
      history.push('/customers?page=1')
      return
    }
    getCustomers().then()
  }, [refreshPage, query.get('page')])

  return (
    <>
      {!customers && !meta && <CustomersListSkeleton />}
      {customers && meta && (
        <div className="customers">
          <div className="top-container">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="customer-list">
            <div className="legend">
              <span>Username</span>
              <span>E-mail</span>
              <span>phoneNumber</span>
              <span>First Name</span>
              <span>Last Name</span>
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
