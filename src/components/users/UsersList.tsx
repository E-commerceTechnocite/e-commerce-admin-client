import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { UserModel } from '../../models/user/user.model'
import './UsersList.scss'
import UsersListSkeleton from './skeleton/UsersListSkeleton'
import Granted from '../Granted'
import { useQuery } from '../../util/hook/useQuery'
import Legend from '../legend/legend'

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
  const [users, setUsers] = useState<UserModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState(false)
  const [toastEdit, setToastEdit] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns get request for users list
   * @returns request
   */
  const pageRequest = () =>
    http.get<PaginationModel<UserModel>>(
      `${config.api}/v1/user${
        query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('page')}${number ? '&limit=' + number : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )

  /**
   * Submits get request for users list
   * @returns void
   */
  const getUsers = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      if (error.statusCode === 405) {
        // TODO when feature available
        // redirect if search incorrect
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
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
        history.push('/login')
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
            {pagination && (
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
            )}
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
              <Legend uri={`/users`} name={`Username`} search={`username`} />
              <Legend uri={`/users`} name={`Role`} search={`role`} />
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
                    <span>{user.username}</span>
                    <span>{user.role.name}</span>
                    <span>{user.email}</span>
                    <Granted permissions={['u:user']}>
                      <Link
                        to={`/users/edit/${user.id}?page=${query.get('page')}${
                          query.get('search') && query.get('order')
                            ? `&search=${query.get('search')}&order=${query.get(
                                'order'
                              )}`
                            : ``
                        }`}
                        className="action"
                      >
                        Edit
                      </Link>
                    </Granted>
                    <Granted permissions={['d:user']}>
                      <button
                        className="delete"
                        onClick={() => deleteUsers(user.id, user.username)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
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
