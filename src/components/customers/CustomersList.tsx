import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Loading from '../loading/Loading'
import Pagination from '../pagination/Pagination'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import './CustomersList.scss'
import { CustomerModel } from '../../models/customer/customer.model'

interface ICustomersListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const CustomersList = () => {
/*const CustomersList: React.FunctionComponent<ICustomersListProps> = ({
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
  // Request to get the page of the users list
  const pageRequest = () =>
    http.get<PaginationModel<CustomerModel>>(
      `${config.api}/v1/customers?page=${page}${number ? '&limit=' + number : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  const getCustomers = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      history.push('/login')
    }
    setCustomers(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/customers/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  const deleteUsers = async (id: string, customer: string) => {
    if (confirm(`Delete customer: ${customer}?`)) {
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
    getCustomers().then()
  }, [page, refreshPage])

  return ( "true"
    <>
      <div className="users">
        <div className="top-container">
          {pagination && (
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          )}
          <Link to="/users/addusers" className="action">
            New User
          </Link>
          <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
            {' '}
            <i className="fas fa-check" />
            User Added
            <i className="fas fa-times" onClick={() => setToast(false)} />
          </div>
        </div>
        {!customers && !meta && <Loading />}
        {customers && meta && (
          <>
            <div className="user-list">
              <div className="legend">
                <span>Username</span>
                <span>Role</span>
                <span>E-mail</span>
              </div>
              {customers.map((user) => {
                return (
                  <div className="user" key={user.id}>
                    <span>{user.username}</span>
                    <span>{user.role.name}</span>
                    <span>{user.email}</span>
                    <Link to={`/users/edit/${user.id}`} className="action">
                      Edit
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteUsers(user.id, user.username)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )
              })}
              {pagination && <Pagination meta={meta} pageSetter={setPage} />}
            </div>
          </>
        )}
      </div>
    </>
  )*/
}

export default CustomersList
