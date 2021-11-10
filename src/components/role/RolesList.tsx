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
import { RoleModel } from '../../models/role/role.model'
import { auth } from '../../util/helpers/auth'
import Granted from '../Granted'
import './RolesList.scss'
import { useQuery } from '../../util/hook/useQuery'
import RolesListSkeleton from './skeleton/RolesListSkeleton'
import Legend from '../legend/legend'

interface IRolesListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const RolesList: React.FunctionComponent<IRolesListProps> = ({
  number,
  pagination,
  success,
  successEdit,
}) => {
  const [roles, setRoles] = useState<RoleModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState(false)
  const [toastEdit, setToastEdit] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns get request for roles
   * @returns request
   */
  const pageRequest = () =>
    http.get<PaginationModel<RoleModel>>(
      `${config.api}/v1/role${
        query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('page')}${number ? '&limit=' + number : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
      }
    )

  /**
   * Submits get request for roles
   * @returns void
   */
  const getRoles = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 400) {
        history.push('/roles')
        return
      }
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
    setRoles(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request for specific role
   * @param id
   * @returns request
   */
  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/role/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }

  /**
   * Submits delete request for specific role
   * @param id
   * @param role
   */
  const deleteRoles = async (id: string, role: string) => {
    if (confirm(`Delete role: ${role}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        alert('WARNING : AN ERROR OCCURED !')
        if (error.message === 'Error 500 Internal Server Error')
          alert(
            "You can't delete this role cause at least one user is assigned to this role"
          )
      }
      setRefreshPage(!refreshPage)
    }
  }

  // Check if role has been added and if so displays a toast
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
      history.push('/roles?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getRoles().then()
  }, [refreshPage, query.get('page'), query.get('search'), query.get('order')])

  return (
    <>
      {!roles && !meta && <RolesListSkeleton />}
      {roles && meta && (
        <div className="roles">
          <div className="top-container">
            {pagination && (
              <div className="search">
                <i className="fas fa-search" />
                <input type="text" placeholder="Search..." />
              </div>
            )}
            <Granted permissions={['c:role']}>
              <Link to="/roles/addroles" className="action">
                New Role
              </Link>
            </Granted>
            {success && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Role Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Role Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>

          <div className="role-list">
            <div className="legend">
              <Legend uri={`/roles`} name={`Role`} search={`name`} />
            </div>
            {roles.map((role) => {
              return (
                <div className="role" key={role.id}>
                  <span>{role.name}</span>
                  <Granted permissions={['u:role']}>
                    <Link
                      to={`/roles/edit/${role.id}?page=${query.get('page')}${
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
                  <Granted permissions={['d:role']}>
                    <button
                      className="delete"
                      onClick={() => deleteRoles(role.id, role.name)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </Granted>
                </div>
              )
            })}
            {pagination && <Pagination meta={meta} uri={'/roles?page='} />}
          </div>
        </div>
      )}
    </>
  )
}

export default RolesList
