import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { http } from '../../util/http'
import { config } from '../../index'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { sendRequest } from '../../util/helpers/refresh'
import ArrowPrevious from '../previous/ArrowPrevious'

const ActionRole: React.FunctionComponent = () => {
  const history = useHistory()
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [permissions, setPermissions] = useState([])
  const [myInputValue, setMyInputValue] = useState('')
  const [submitError, setSubmitError] = useState<string>(null)
  const params: { slug: string } = useParams()
  const perms = {}

  /*const rolePostRequest = (data: RoleModel) => {
        if (params.slug) {
          return http.patch(`${config.api}/v1/role/${params.slug}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
        }
        return http.post(`${config.api}/v1/role`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
    }

    const submitRolePost = async (data: RoleModel) => {
      setSubmitError(null)
      console.log(data)
      let { error } = await sendRequest(rolePostRequest, data)
      if (error) {
          history.push("/login")
      }
      history.push({
          pathname: "/roles",
          state: { success: true },
      })
    }

    const onSubmit = (e: React.FormEvent): void => {
        const body = JSON.stringify({ name: myInputValue, permissions: rolePermissions }) as RoleModel
        submitRolePost(body)
    }*/

  const permissionsRequest = () => {
    return http.get<PaginationModel<any>>(`${config.api}/v1/role/permissions`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }

  const SubmitPermissions = async () => {
    let { data, error } = await sendRequest(permissionsRequest)
    if (error) {
      history.push('/login')
    }
    setPermissions(data) //Error? NO IT WORKS!
  }

  useEffect(() => {
    SubmitPermissions().then()
  }, [params.slug])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  permissions.forEach((item) => {
    let [operation, entity] = item.split(':')
    entity = entity.replace(/-/g, ' ') //replace dash between words with space
    const capitalizeEntity = capitalizeFirstLetter(entity)
    let name = null

    if (!perms[capitalizeEntity]) perms[capitalizeEntity] = []

    if (operation === 'r') name = 'Read'
    if (operation === 'c') name = 'Create'
    if (operation === 'u') name = 'Update'
    if (operation === 'd') name = 'Delete'

    perms[capitalizeEntity].push({
      value: item,
      title: capitalizeEntity,
      name: name,
    })
  })

  const checkboxChange = (e: boolean, value: string) => {
    if (e) setRolePermissions([...rolePermissions, value])
    else setRolePermissions(rolePermissions.filter((item) => item !== value))
  }

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const body = JSON.stringify({
      name: myInputValue,
      permissions: rolePermissions,
    })
    const token = sessionStorage.getItem('token')
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    if (params.slug) {
      http.patch<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/role/${params.slug}`,
        body,
        options
      )
    } else {
      http.post<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/role`,
        body,
        options
      )
    }
    setSubmitError(null)
    history.push({
      pathname: '/roles',
      state: { success: true },
    })
  }

  return (
    <>
      {permissions && (
        <>
          <ArrowPrevious />
          <form onSubmit={onSubmit}>
            <div className="perms-form">
              <div className="role-name">
                <div className="role-name-title">
                  <h3>Role name</h3>
                </div>
                <div className="role-name-entry">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Type here..."
                    required
                    onChange={(e) => setMyInputValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="role-permissions">
                <div className="role-permissions-title">
                  <h3>Role permissions</h3>
                </div>
                <div className="permissions-list">
                  {Object.entries(perms).map(([title, arr], index) => {
                    return (
                      <div className="permissions-choices" key={index}>
                        <div className="permissions-choices-title">
                          <h4>{title}</h4>
                        </div>
                        <div className="attrs" id="attrs">
                          {Object.values(arr).map((perm, index) => {
                            return (
                              <div className="checkBox" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={perm.value}
                                    name={perm.value}
                                    onChange={(e) =>
                                      checkboxChange(
                                        e.target.checked,
                                        perm.value
                                      )
                                    }
                                  ></input>
                                  {perm.name}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="perms-button">
                <button type="submit" className="action">
                  Submit
                </button>
              </div>
              {submitError && <div className="global-error">{submitError}</div>}
            </div>
          </form>
        </>
      )}
    </>
  )
}

export default ActionRole
