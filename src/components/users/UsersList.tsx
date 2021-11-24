import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import UsersListSkeleton from './skeleton/UsersListSkeleton'
import { UserModel } from '../../models/user/user.model'
import { sendRequest } from '../../util/helpers/refresh'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import param from '../../util/helpers/queries'
import { auth } from '../../util/helpers/auth'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Uri from '../../util/helpers/Uri'
import { Link } from 'react-router-dom'
import { http } from '../../util/http'
import { motion } from 'framer-motion'
import Legend from '../legend/legend'
import { config } from '../../index'
import Toast from '../toast/Toast'
import Granted from '../Granted'
import * as React from 'react'
import './UsersList.scss'

interface IUsersListProps {
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const UsersList: React.FunctionComponent<IUsersListProps> = ({
  pagination,
  success,
  successEdit,
}) => {
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [refreshPage, setRefreshPage] = useState(false)
  const [users, setUsers] = useState<UserModel[]>()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns get request for users list
   * @returns request
   */
  const pageRequest = () => {
    const url = !query.get('q')
      ? new Uri('/v1/user')
      : new Uri('/v1/user/search')
    url
      .setQuery('page', query.get('page') ? query.get('page') : '1')
      .setQuery('orderBy', query.get('search'))
      .setQuery('order', query.get('order'))
      .setQuery('q', query.get('q'))

    return http.get<PaginationModel<UserModel>>(url.href, {
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
            <Granted permissions={['c:user']}>
              <Link to="/users/addusers" className="action">
                New User
              </Link>
            </Granted>
            {success && <Toast success={success} name={`User`} />}
            {successEdit && (
              <Toast success={successEdit} name={`User`} edit={true} />
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
                      {!user.role.superAdmin && (
                        <Link
                          to={`/users/edit/${user.id}${queries.page(
                            'page',
                            1
                          )}${
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
                      {!user.role.superAdmin  && (
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
