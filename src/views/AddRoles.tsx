import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { http } from '../util/http'
import { config } from '../index'
import Loading from '../components/loading/Loading'
import { auth } from '../util/helpers/auth'

const AddRoles: React.FunctionComponent = () => {
  const history = useHistory()
  const [role, setRole] = useState<string[]>([])
  const [permissions, setPermissions] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [myInputValue, setMyInputValue] = useState('')
  const perms = {}

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const options = {
      headers: { Authorization: `Bearer ${token}` },
    }
    http
      .get<[]>(`${config.api}/v1/role/permissions`, options)
      .then(({ data, error }) => {
        setIsPending(true)
        if (!error) {
          setPermissions(data)
          setIsPending(false)
        }
      })
  }, [])

  permissions.forEach((item) => {
    const [operation, entity] = item.split(':')
    let name = null
    if (!perms[entity]) perms[entity] = []
    switch (operation) {
      case 'r':
        name = 'read'
        break
      case 'c':
        name = 'create'
        break
      case 'u':
        name = 'update'
        break
      case 'd':
        name = 'delete'
        break
      default:
        break
    }
    perms[entity].push({
      value: item,
      title: entity,
      name: name,
    })
  })

  const checkboxChange = (e: boolean, value: string) => {
    if (e) setRole([...role, value])
    else setRole(role.filter((item) => item !== value))
  }

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setIsPending(true)
    const body = JSON.stringify({ name: myInputValue, permissions: role })
    const options = {
      headers: { 'Content-Type': 'application/json', ...auth.headers },
    }
    http
      .post<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/role`,
        body,
        options
      )
      .then(() => history.push('/roles'))
  }

  return (
    <>
      {isPending && <Loading />}
      {!isPending && (
        <form onSubmit={onSubmit}>
          <div>
            <label>Role's name</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter the name here..."
              required
              onChange={(e) => setMyInputValue(e.target.value)}
            ></input>
            <div className="AddWrap">
              {Object.entries(perms).map(([title, arr], index) => {
                return (
                  <div key={index}>
                    <h3>{title}</h3>
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
                                  checkboxChange(e.target.checked, perm.value)
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
            <div>
              <button type="submit" className="action">
                Soumettre
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default AddRoles
