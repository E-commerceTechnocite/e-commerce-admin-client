import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { http } from '../../util/http'
import { config } from '../../index'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { sendRequest } from '../../util/helpers/refresh'
import ArrowPrevious from '../previous/ArrowPrevious'
import { RoleModel } from '../../models/role/role.model'

interface IActionRoleProps {}

/*interface InitialValues {
  name: string
  permissions: string
}*/

const ActionRole: React.FunctionComponent<IActionRoleProps> = () => {
  const history = useHistory()
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [permissions, setPermissions] = useState([])
  const [myInputValue, setMyInputValue] = useState('')
  const [submitError, setSubmitError] = useState<string>(null)
  //const [initialValues, setInitialValues] = useState<InitialValues>()
  const params: { slug: string } = useParams()
  const perms = {}

  const rolePostRequest = (data: RoleModel) => {
        if (params.slug) {
          console.log(params.slug) 
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
        e.preventDefault()
        const body = JSON.stringify({ name: myInputValue, permissions: rolePermissions }) as RoleModel
        submitRolePost(body)
    }

  const permissionsRequest = () => {
    return http.get<React.SetStateAction<any>>(`${config.api}/v1/role/permissions`, {
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

  const currentPermissionsRequest = () => {
    return http.get<React.SetStateAction<any>>(`${config.api}/v1/role/${params.slug}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
  })
  }

  const SubmitCurrentUser = async () => {
    let { data, error } = await sendRequest(currentPermissionsRequest)
    if (error) {
      history.push("/login")
    }
    //setPermissions(data.permissions)
    setRolePermissions((permission) => [...permission, data.permissions])
    console.log(permissions)
    /*const allCheckbox : any = document.querySelectorAll('input[name=toggleAll]')
    allCheckbox[0].checked = true*/
    const name : any = document.querySelectorAll('input[name=name]');
    console.log(data.name)
    name[0].value = data.name
    initializeCheckboxes(data.permissions)
  }

  const initializeCheckboxes = (perm) => {
    console.log(permissions)
    perm.map((perm) => {
      const check : any = document.querySelectorAll("[id='" + perm +"']")
      for (let i = 0; i < check.length; i++) {
        check[i].checked = true
      }
    })
  }

  useEffect(() => {
    SubmitPermissions().then()
    if (params.slug) {
      SubmitCurrentUser().then()
    }
  }, [params.slug])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  permissions.forEach((item) => {
    let [operation, entity] = item.split(':')
    const capitalizeEntity = capitalizeFirstLetter(entity)
    const entityDash = capitalizeEntity
    entity = entity.replace(/-/g, ' ') //replace dash between words with space
    let name = null

    if (!perms[entityDash]) perms[entityDash] = []

    if (operation === 'r') name = 'Read'
    if (operation === 'c') name = 'Create'
    if (operation === 'u') name = 'Update'
    if (operation === 'd') name = 'Delete'

    perms[entityDash].push({
      value: item,
      title: capitalizeEntity,
      name: name,
    })
  })

  const checkboxChange = (e: boolean, value: string) => {
    if (e) setRolePermissions([...rolePermissions, value])
    else setRolePermissions(rolePermissions.filter((item) => item !== value))

    let [operation, entity] = value.split(':')
    entity = capitalizeFirstLetter(entity)
    const headCheckbox : any = document.querySelectorAll('input[name=' + entity + ']')
    const allCheckbox : any = document.querySelectorAll('input[name=toggleAll]')
    if(e) {
      let counter = 0
      for (let i = 0; i < headCheckbox.length; i++) {
          if (headCheckbox[i].checked)
              counter++
      }
      if(counter === 4) headCheckbox[0].checked = true
      if(rolePermissions.length +1 === permissions.length) allCheckbox[0].checked = true
    }
      
    if(!e) {
      headCheckbox[0].checked = false
      allCheckbox[0].checked = false
    }
  }

  const toggleAll = (source) => {
    const checkboxes : any = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
    setRolePermissions([])
    if(source.checked) setRolePermissions(permissions)
  }

  const togglePermsAll = (source, title) => {
    title = title.replace(/ /g, '-')
    const checkboxes : any = document.querySelectorAll('input[name=' + title + ']');
    const allCheckbox : any = document.querySelectorAll('input[name=toggleAll]')
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
    if(source.checked) {
      checkboxes.forEach((element) => {
        if (rolePermissions.indexOf(element.id) === -1) {
          if(element.id !== "") setRolePermissions((permission) => [...permission, element.id])
         }          
      });
      if(rolePermissions.length +4 === permissions.length) allCheckbox[0].checked = true
    }
    else {
      allCheckbox[0].checked = false
      checkboxes.forEach((element) => {
        if (rolePermissions.indexOf(element.id) !== -1) {
          setRolePermissions((permissions) => permissions.filter((item) => item !== element.id))
         }          
      });
    }
  }

  /*const onSubmit = (e: React.FormEvent): void => {
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
  }*/

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
                  <input className="toggleAll" type="checkbox" name="toggleAll" onChange={(e) => toggleAll(e.target)}/> 
                    Toggle All
                    <br/>
                </div>
                <div className="permissions-list">
                  {Object.entries(perms).map(([title, arr], index) => {
                    return (
                      <div className="permissions-choices" key={index}>
                        <div className="permissions-choices-title"> 
                          <h4>
                            <input type="checkbox" name={title} onChange={(e) => togglePermsAll(e.target,title)}/> 
                              {title}
                          </h4>
                        </div>
                        <div className="attrs" id="attrs">
                          {Object.values(arr).map((perm, index) => {
                            return (
                              <div className="checkBox" key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={perm.value}
                                    name= {perm.title}
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
