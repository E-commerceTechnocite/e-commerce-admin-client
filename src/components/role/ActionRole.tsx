import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { http } from '../../util/http'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import ArrowPrevious from '../previous/ArrowPrevious'
import { RoleModel } from '../../models/role/role.model'

interface IActionRoleProps {}

const ActionRole: React.FunctionComponent<IActionRoleProps> = () => {
  const history = useHistory()
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [allPermissions, setAllPermissions] = useState([])
  const [myInputValue, setMyInputValue] = useState('')
  const [submitError, setSubmitError] = useState<string>(null)
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
    return http.get<string[]>(`${config.api}/v1/role/permissions`, {
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
    setAllPermissions(data) 
  }

  const currentPermissionsRequest = () => {
    return http.get<RoleModel>(`${config.api}/v1/role/${params.slug}`, {
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
    setRolePermissions(data.permissions)
    setName(data.name)
    initializeCheckboxes(data.permissions)
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const crudTogglePermsCheckbox = (permsCheckbox) => {
    let counter = 0
    for (let i = 0; i < permsCheckbox.length; i++) {
      console.log(permsCheckbox[i].checked)
      if (i !== 0 && permsCheckbox[i].checked)
        counter++
    }
    if(counter === 4) 
      permsCheckbox[0].checked = true
    else
      permsCheckbox[0].checked = false
  }

  const setName = (name) => {
    const nameLabel : any = document.querySelectorAll('input[name=name]')
    nameLabel[0].value = name
    setMyInputValue(name)
  }

  const initializeCrudCheckboxes = (perm) => {
    perm.map((permi) => {
      const check : any = document.querySelectorAll("[id='" + permi +"']")
      check[0].checked = true
    })
  }

  const initializePermsCheckboxes = (perms) => {
    perms.map((perm) => {
      let [operation, title] = perm.split(':')
      const permsCheckbox : any = document.querySelectorAll('input[name=' + title + ']')
      crudTogglePermsCheckbox(permsCheckbox)
    })
  }

  const initializeCheckboxes = (perm) => {
    initializeCrudCheckboxes(perm)
    initializePermsCheckboxes(perm)
  }
  
  useEffect(() => {
    const allCheckbox : any = document.querySelectorAll('input[name=toggleAll]')
    if(rolePermissions.length === allPermissions.length && rolePermissions.length !== 0) {
      allCheckbox[0].checked = true // check the select all checkbox if all checkboxes are checked 
    }
    else
      allCheckbox[0].checked = false
    
    rolePermissions.map((perm) => {
      let [operation, title] = perm.split(':')
      const permsCheckbox : any = document.querySelectorAll('input[name=' + title + ']')
      crudTogglePermsCheckbox(permsCheckbox)
    })
  }, [rolePermissions])

  useEffect(() => {
    SubmitPermissions().then()
  }, [])

  useEffect(() => {
    if (params.slug) {
      SubmitCurrentUser().then()
    }
  }, [params.slug])

  const changeTitleForm = (title) => {
    title = capitalizeFirstLetter(title)
    title = title.replace(/-/g, ' ')
    return title
  }

  const crudName = (operation) => {
    if (operation === 'r') return 'Read'
    if (operation === 'c') return 'Create'
    if (operation === 'u') return 'Update'
    if (operation === 'd') return 'Delete'
  }

  allPermissions.forEach((item) => {
    const [operation, title] = item.split(':')
    const name = crudName(operation)
    if (!perms[title]) perms[title] = []
    perms[title].push({
      value: item,
      title: title,
      name: name,
    })
  })

  const checkboxClick = (onClick: boolean, value: string) => {
    if(onClick) setRolePermissions([...rolePermissions, value])
    else setRolePermissions(rolePermissions.filter((item) => item !== value))
  }

  const changeAllCheckboxes = (checkboxes, source) => { //change multiple checkboxes for ( selectAll and Permission checkboxes)
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] != source)
        checkboxes[i].checked = source.checked;
    }
  }

  const toggleAll = (source) => {
    const checkboxes : any = document.querySelectorAll('input[type="checkbox"]')
    changeAllCheckboxes(checkboxes, source)
    setRolePermissions([])
    if(source.checked) setRolePermissions(allPermissions)
  }

  const togglePermsAll = (source, title) => {
    const checkboxes : any = document.querySelectorAll('input[name=' + title + ']')
    changeAllCheckboxes(checkboxes, source) // 4 crud check/uncheck if we check/uncheck permissions checkbox
    
    if(source.checked) {
      checkboxes.forEach((element) => { // if the c,r,u,d is not checked yet we add the value in permissions array
        if (rolePermissions.indexOf(element.id) === -1) {
          if(element.id !== "") 
            setRolePermissions((permission) => [...permission, element.id])
        }          
      })
    } else {
      checkboxes.forEach((element) => { //if c,r,u,d is not unchecked we remove the value in the permissions array
        if (rolePermissions.indexOf(element.id) !== -1) {
          setRolePermissions((permissions) => permissions.filter((item) => item !== element.id))
        }          
      })
    }
  }

  return (
    <>
      {allPermissions && (
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
                <div className="toggleAll">
                  <input type="checkbox" name="toggleAll" onChange={(e) => toggleAll(e.target)}/> 
                  Select All
                </div>
                <div className="permissions-list">
                  {Object.entries(perms).map(([title, arr], index) => {
                    return (
                      <div className="permissions-choices" key={index}>
                        <div className="permissions-choices-title"> 
                          <h4>
                            <input type="checkbox" name={title} onChange={(e) => togglePermsAll(e.target,title)}/> 
                            {changeTitleForm(title)}
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
                                      checkboxClick(
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
