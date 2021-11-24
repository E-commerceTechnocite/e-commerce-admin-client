import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import RolesListSkeleton from './skeleton/RolesListSkeleton'
import { sendRequest } from '../../util/helpers/refresh'
import { RoleModel } from '../../models/role/role.model'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Uri from '../../util/helpers/Uri'
import { Link } from 'react-router-dom'
import { http } from '../../util/http'
import Legend from '../legend/legend'
import { config } from '../../index'
import Toast from '../toast/Toast'
import Granted from '../Granted'
import * as React from 'react'
import './RolesList.scss'

interface IRolesListProps {
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const RolesList: React.FunctionComponent<IRolesListProps> = ({
  pagination,
  success,
  successEdit,
}) => {
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [refreshPage, setRefreshPage] = useState(false)
  const [roles, setRoles] = useState<RoleModel[]>()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns get request for roles
   * @returns request
   */
  const pageRequest = () => {
    const url = !query.get('q')
      ? new Uri('/v1/role')
      : new Uri('/v1/role/search')
    url
      .setQuery('page', query.get('page') ? query.get('page') : '1')
      .setQuery('orderBy', query.get('search'))
      .setQuery('order', query.get('order'))
      .setQuery('q', query.get('q'))

    return http.get<PaginationModel<RoleModel>>(url.href, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Submits get request for roles
   * @returns void
   */
  const getRoles = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/roles')
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
        ...auth.headers,
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
            <Granted permissions={['c:role']}>
              <Link to="/roles/addroles" className="action">
                New Role
              </Link>
            </Granted>
            {success && <Toast success={success} name={`User`} />}
            {successEdit && (
              <Toast success={successEdit} name={`User`} edit={true} />
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
                    {!role.superAdmin && (
                      <Link
                        to={`/roles/edit/${role.id}${queries.page('page', 1)}${
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
                  <Granted permissions={['d:role']}>
                    {!role.superAdmin && (
                      <button
                        className="delete"
                        onClick={() => deleteRoles(role.id, role.name)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    )}
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
