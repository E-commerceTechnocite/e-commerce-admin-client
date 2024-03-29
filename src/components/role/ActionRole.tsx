import { sendRequest } from '../../util/helpers/refresh'
import { RoleModel } from '../../models/role/role.model'
import LoadingButton from '../loading/LoadingButton'
import { useHistory, useParams } from 'react-router'
import { useQuery } from '../../util/hook/useQuery'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import Previous from '../previous/Previous'
import { useEffect, useState } from 'react'
import { http } from '../../util/http'
import { config } from '../../index'
import * as React from 'react'
import './ActionRole.scss'

interface IActionRoleProps {}

const ActionRole: React.FunctionComponent<IActionRoleProps> = () => {
  const [rolePermissions, setRolePermissions] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string>(null)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [allPermissions, setAllPermissions] = useState([])
  const [myInputValue, setMyInputValue] = useState('')
  const allCheckbox: any = document.querySelectorAll('input[name=toggleAll]')
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()
  const perms = {}

  const rolePostRequest = (data: RoleModel) => {
    if (params.slug) {
      return http.patch(`${config.api}/v1/role/${params.slug}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
      })
    }
    return http.post(`${config.api}/v1/role`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  const submitRolePost = async (data: RoleModel) => {
    setSubmitError(null)
    let { error } = await sendRequest(rolePostRequest, data)
    if (error) {
      history.push('/login')
    }
    if (query.get('page')) {
      history.push({
        pathname: '/roles',
        search: `${queries.page('page')}${queries.search(
          'search'
        )}${queries.order('order')}${queries.q('q')}`,
        state: { successEdit: true },
      })
      return
    }
    history.push({
      pathname: '/roles',
      search: `?page=1&s=u`,
      state: { success: true },
    })
  }

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setIsSubmit(true)
    const body = JSON.stringify({
      name: myInputValue,
      permissions: rolePermissions,
    }) as RoleModel
    submitRolePost(body)
  }

  const permissionsRequest = () => {
    return http.get<string[]>(`${config.api}/v1/role/permissions`, {
      headers: {
        ...auth.headers,
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
        ...auth.headers,
      },
    })
  }

  const SubmitCurrentUser = async () => {
    let { data, error } = await sendRequest(currentPermissionsRequest)
    if (error) {
      history.push('/login')
    }
    setRolePermissions(data.permissions)
    setMyInputValue(data.name)
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const toggleCRUDAllCheckbox = (crud: string, id: string) => {
    const crudAllCheckbox: any = document.querySelectorAll(
      'input[name=' + crud + 'Toggle]'
    )
    const crudCheckboxes: any = document.querySelectorAll("[id^='" + id + "']")
    crudAllCheckbox[0].checked = true
    for (let i = 0; i < crudCheckboxes.length; i++) {
      if (!crudCheckboxes[i].checked) {
        crudAllCheckbox[0].checked = false
      }
    }
  }

  const updateCRUDAllcheckboxes = () => {
    toggleCRUDAllCheckbox('read', 'r:')
    toggleCRUDAllCheckbox('create', 'c:')
    toggleCRUDAllCheckbox('update', 'u:')
    toggleCRUDAllCheckbox('delete', 'd:')
  }

  const updateCrudCheckboxes = (perm) => {
    perm.map((permi) => {
      const check: any = document.querySelectorAll("[id='" + permi + "']")
      check[0].checked = true
    })
  }

  const updatePermsCheckboxes = (perms) => {
    perms.map((perm) => {
      let [operation, title] = perm.split(':')
      const pCheckbox: any = document.querySelectorAll(
        'input[name=' + title + ']'
      )
      if (
        pCheckbox[1].checked &&
        pCheckbox[2].checked &&
        pCheckbox[3].checked &&
        pCheckbox[4].checked
      ) {
        pCheckbox[0].checked = true
      } else {
        pCheckbox[0].checked = false
      }
    })
  }

  const updateAllCheckbox = () => {
    const allCheckbox: any = document.querySelectorAll('input[name=toggleAll]')
    if (
      rolePermissions.length === allPermissions.length &&
      rolePermissions.length !== 0
    )
      allCheckbox[0].checked = true
    else allCheckbox[0].checked = false
  }

  useEffect(() => {
    SubmitPermissions().then()
  }, [])

  useEffect(() => {
    updateAllCheckbox()
    updateCrudCheckboxes(rolePermissions)
    updatePermsCheckboxes(rolePermissions)
    updateCRUDAllcheckboxes()
  }, [allCheckbox])

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

  const cr = (operation) => {
    switch (operation) {
      case 'r':
        return 'Read'
      case 'c':
        return 'Create'
      case 'u':
        return 'Update'
      case 'd':
        return 'Delete'
    }
  }

  allPermissions.forEach((item) => {
    const [operation, title] = item.split(':')
    const name = cr(operation)
    if (!perms[title]) perms[title] = []
    perms[title].push({
      value: item,
      title: title,
      name: name,
    })
  })

  const checkboxClick = (onClick: boolean, value: string) => {
    if (onClick) setRolePermissions((permission) => [...permission, value])
    else
      setRolePermissions((permissions) =>
        permissions.filter((item) => item !== value)
      )
  }

  const changeAllCheckboxes = (checkboxes: any, source: any) => {
    //change multiple checkboxes for ( selectAll and Permission checkboxes)
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] != source && checkboxes[i].checked != source.checked) {
        checkboxes[i].checked = source.checked
        if (source.checked && checkboxes[i].id !== '')
          checkboxClick(true, checkboxes[i].id)
        else checkboxClick(false, checkboxes[i].id)
      }
    }
  }

  const toggleAll = (source) => {
    const checkboxes: any = document.querySelectorAll('input[type="checkbox"]')
    changeAllCheckboxes(checkboxes, source)
  }

  const togglePermsAll = (source, title) => {
    const checkboxes: any = document.querySelectorAll(
      'input[name=' + title + ']'
    )
    changeAllCheckboxes(checkboxes, source)
  }

  const toggleCRUDAll = (source) => {
    const checkboxes: any = document.querySelectorAll(
      "[id^='" + source.name.charAt(0) + ":']"
    )
    changeAllCheckboxes(checkboxes, source)
  }

  const toggleAllComponents = (name : string ,
                 changeToggle : any,
                 label: string) => {
    return ( <>
        <input
        type="checkbox"
        name={name}
        onChange={(e) => changeToggle(e.target)}
        />
        <label>{label}</label>
      </> 
    )
  }

  return (
    <>
      {allPermissions && (
        <>
          <Previous />
          <form onSubmit={onSubmit}>
            <div className="perms-form">
              <div className="add-user-title">
                {params.slug && <label>Edit role</label>}
                {!params.slug && <label>New role</label>}
              </div>
              <div className="role-name">
                <div className="role-name-title">
                  <label>Role name</label>
                </div>
                <div className="role-name-entry">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={myInputValue}
                    placeholder="Type here..."
                    required
                    onChange={(e) => setMyInputValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="role-permissions">
                <div className="role-permissions-title">
                  <label>Role permissions</label>
                </div>
                <div className="permissions-all">
                  <div className="permissions-list">
                    {Object.entries(perms).map(([title, arr], index) => {
                      return (
                        <div className="permissions-choices" key={index}>
                          <div className="permissions-choices-title">
                            <input
                              type="checkbox"
                              name={title}
                              onChange={(e) => togglePermsAll(e.target, title)}
                            />
                            <label>{changeTitleForm(title)}</label>
                          </div>
                          <div className="attrs" id="attrs">
                            {Object.values(arr).map((perm, index) => {
                              return (
                                <div className="checkBox" key={index}>
                                  <input
                                    type="checkbox"
                                    id={perm.value}
                                    name={perm.title}
                                    onChange={(e) =>
                                      checkboxClick(
                                        e.target.checked,
                                        perm.value
                                      )
                                    }
                                  />
                                  <label>{perm.name}</label>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="toggleAll">
                    <div className="all">
                      {toggleAllComponents("toggleAll",toggleAll,"All Permissions")}
                    </div>
                    <div className="crud">
                      {toggleAllComponents("readToggle",toggleCRUDAll,"Read")}
                      {toggleAllComponents("createToggle",toggleCRUDAll,"Create")}
                      {toggleAllComponents("updateToggle",toggleCRUDAll,"Update")}
                      {toggleAllComponents("deleteToggle",toggleCRUDAll,"Delete")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="perms-button">
                {!isSubmit && (
                  <button type="submit" className="action">
                    Submit
                  </button>
                )}
                {isSubmit && <LoadingButton />}
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
