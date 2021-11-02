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

interface ICustomersListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const CustomersList: React.FunctionComponent<ICustomersListProps> = ({
  number,
  pagination,
  success,
}) => {
  const [customers, setCustomers] = useState<CustomerModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()

  /*<PaginationModel<CustomerModel>> */
  /* ?page=${page}${number ? '&limit=' + number : ''}*/
  /**
   * Returns the get request of the customers list
   * @returns request
   */
  const customersRequest = () =>
    http.get<CustomerModel[]>(`${config.api}/v1/customers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })

  /**
   * Sends the get request of the customers list and sets customers & pagination state
   */
  const getCustomers = async () => {
    let { data, error } = await sendRequest(customersRequest)
    if (error) {
      history.push('/login')
    }
    setCustomers(data)
    // setCustomers(data.data)
    // setMeta(data.meta)
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
        console.log(error.message)
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }

  // Check if customer has been added and if so displays a toast
  useEffect(() => {
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  useEffect(() => {
    getCustomers().then()
  }, [page, refreshPage])

  return (
    <>
      {/* {!customers && !meta && <CustomersListSkeleton />} */}
      {customers && (
        <div className="customers">
          <div className="top-container">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            {/*  {pagination && (
            )} */}
            {/* <Granted permissions={['c:customer']}> */}
            <Link to="/customers/add-customer" className="action">
              New Customer
            </Link>
            {/* </Granted> */}
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Customer Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
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
                    {/* <Granted permissions={['u:customer']}> */}
                    <Link
                      to={`/customers/edit-customer/${customer.id}`}
                      className="action"
                    >
                      Edit
                    </Link>
                    {/* </Granted> */}
                    {/* <Granted permissions={['d:customer']}> */}
                    <button
                      className="delete"
                      onClick={() =>
                        deleteCustomer(customer.id, customer.username)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    {/* </Granted> */}
                  </motion.div>
                )
              })}
            </motion.div>
            {/* {pagination && <Pagination meta={meta} pageSetter={setPage} />} */}
          </div>
        </div>
      )}
    </>
  )
}

export default CustomersList