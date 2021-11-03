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

interface IUsersListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const UsersList: React.FunctionComponent<IUsersListProps> = ({
  number,
  pagination,
  success,
}) => {
  const [users, setUsers] = useState<UserModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()
  // Request to get the page of the users list
  const pageRequest = () =>
    http.get<PaginationModel<UserModel>>(
      `${config.api}/v1/user?page=${query.get('page')}${
        number ? '&limit=' + number : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  const getUsers = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
    setUsers(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/user/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  const deleteUsers = async (id: string, username: string) => {
    if (confirm(`Delete user: ${username}?`)) {
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
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  useEffect(() => {
    getUsers().then()
  }, [refreshPage, query.get('page')])

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
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              User Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
            </div>
          </div>
          <div className="user-list">
            <div className="legend">
              <span>Username</span>
              <span>Role</span>
              <span>E-mail</span>
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
                      <Link to={`/users/edit/${user.id}`} className="action">
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
