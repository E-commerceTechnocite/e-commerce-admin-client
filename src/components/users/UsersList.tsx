import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import param, { requestParams } from '../../util/helpers/queries'
import UsersListSkeleton from './skeleton/UsersListSkeleton'
import { UserModel } from '../../models/user/user.model'
import { sendRequest } from '../../util/helpers/refresh'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { http } from '../../util/http'
import { motion } from 'framer-motion'
import Legend from '../legend/legend'
import { config } from '../../index'
import Granted from '../Granted'
import * as React from 'react'
import './UsersList.scss'

interface IUsersListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const UsersList: React.FunctionComponent<IUsersListProps> = ({
  number,
  pagination,
  success,
  successEdit,
}) => {
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [refreshPage, setRefreshPage] = useState(false)
  const [users, setUsers] = useState<UserModel[]>()
  const [toastEdit, setToastEdit] = useState(false)
  const [toast, setToast] = useState(false)
  const requestParam = requestParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns get request for users list
   * @returns request
   */
  const pageRequest = () => {
    const request = !query.get('q')
      ? `${config.api}/v1/user${requestParam.getOrderBy(
          'search',
          'order'
        )}${requestParam.getPage('page')}${number ? '&limit=' + number : ''}`
      : `${config.api}/v1/user/search${requestParam.getPage('page', 'q')}${
          number ? '&limit=' + number : ''
        }${requestParam.getQ('search')}`

    return http.get<PaginationModel<UserModel>>(request, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Submits get request for users list
   * @returns void
   */
  const getUsers = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/users')
        return
      }
      history.push('/login')
    }
    setUsers(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request for specific user
   * @param id
   * @returns request
   */
  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/user/${id}`, null, {
      headers: {
        ...auth.headers,
      },
    })
  }

  /**
   * Submits delete request for specific user
   * @param id
   * @param username
   */
  const deleteUsers = async (id: string, username: string) => {
    if (confirm(`Delete user: ${username}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        //history.push('/login')
        alert('WARNING : AN ERROR OCCURED !')
        if (error.message === 'Error 500 Internal Server Error')
          alert("You can't delete this user")
      }
      setRefreshPage(!refreshPage)
    }
  }

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
    if (!query.get('page')) {
      history.push('/users?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getUsers().then()
  }, [refreshPage, query.get('page'), query.get('search'), query.get('order')])

  return (
    <>
      {!users && !meta && <UsersListSkeleton />}
      {users && meta && (
        <div className="users">
          <div className="top-container">
            {/* 
            {pagination && (
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
            )} */}
            <Granted permissions={['c:user']}>
              <Link to="/users/addusers" className="action">
                New User
              </Link>
            </Granted>
            {success && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                User Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                User Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>
          <div className="user-list">
            <div className="legend">
              <span></span>
              <Legend uri={`/users`} name={`Username`} search={`username`} />
              <Legend uri={`/users`} name={`Role`} search={`role.name`} />
              <Legend uri={`/users`} name={`Email`} search={`email`} />
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
              {users?.map((user) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="user"
                    key={user.id}
                  >
                    <span>
                      <img
                        src={`https://avatars.dicebear.com/api/initials/${user.username}p.svg`}
                      />
                    </span>
                    <span>{user.username}</span>
                    <span>{user.role.name}</span>
                    <span>{user.email}</span>
                    <Granted permissions={['u:user']}>
                      {user.role.name !== 'Admin' && (
                        <Link
                          to={`/users/edit/${user.id}${queries.page('page')}${
                            query.get('search') && query.get('order')
                              ? `${queries.search('search')}${queries.order(
                                  'order'
                                )}`
                              : ``
                          }`}
                          className="action"
                        >
                          Edit
                        </Link>
                      )}
                    </Granted>
                    <Granted permissions={['d:user']}>
                      {user.role.name !== 'Admin' && (
                        <button
                          className="delete"
                          onClick={() => deleteUsers(user.id, user.username)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </Granted>
                  </motion.div>
                )
              })}
            </motion.div>
            {pagination && <Pagination meta={meta} uri="/users?page=" />}
          </div>
        </div>
      )}
    </>
  )
}

export default UsersList
