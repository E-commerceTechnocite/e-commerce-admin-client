import * as React from 'react'
import { useEffect, useState } from 'react'
import { auth } from '../util/helpers/auth'
import { useHistory, useParams } from 'react-router'
import { http } from '../util/http'
import { config } from '../index'
import { sendRequest } from '../util/helpers/refresh'

interface IProfileProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
    }
  }
}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  const [successEdit, setSuccessEdit] = useState<boolean | undefined>()
  const [allPermissions, setAllPermissions] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState("")
  const [role, setRole] = useState('')
  const perms = {}
  //const nameLabel: any = document.querySelectorAll('input[name=username]')
  //const emailLabel: any = document.querySelectorAll('input[name=email]')
  const permissionsRequest = () => {
    return http.get<string[]>(`${config.api}/v1/o-auth/permissions`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }

  const SubmitPermissions = async () => {
    let { data, error } = await sendRequest(permissionsRequest)
    if (error) {
      //history.push('/login') !!!!!!!!!!!!!
    }
    setAllPermissions(data)
  }

  useEffect(() => {
    SubmitPermissions().then()
  }, [])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const changeTitleForm = (title) => {
    title = capitalizeFirstLetter(title)
    title = title.replace(/-/g, ' ')
    return title
  }

  allPermissions.forEach((item) => {
    let [operation, title] = item.split(':')
    title = changeTitleForm(title)
    if (!perms[title]) perms[title] = []
    perms[title].push({
      value: item,
      title: title,
      name: operation,
    })
  })

  useEffect(() => {
    if (props.location.state !== undefined) {
      if (props.location.state.success) setSuccess(props.location.state.success)
      if (props.location.state.successEdit)
        setSuccessEdit(props.location.state.successEdit)
    }
  }, [])

  useEffect(() => {
    setUsername(auth.decodedAccess.username)
    setEmail(auth.decodedAccess.email)
    setRole(auth.decodedAccess.roleName)
  }, [])

  return (
    <div className="userProfile">
        <div className="photoProfile">
            <div><h4>Profile photo</h4></div>
            {/*<img src="../../images/profile.jpg"></img>*/}
            <div className="test"><img src={`https://avatars.dicebear.com/api/initials/${username}p.svg`}></img></div>
        </div>
        <div className="informationProfile">
            <div><h4>Profile informations</h4></div>
            <div className="infos">
                <div className="profileUsername"><h4><label>Username</label></h4></div>
                <div className="profileEntry">
                    <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    required
                    disabled
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="profileUsername"><h4><label>E-mail</label></h4></div>
                <div className="profileEntry">
                    <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    required
                    disabled
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="profileUsername"><h4><label>Role</label></h4></div>
                <div className="profileEntry">
                    <input
                    type="text"
                    id="role"
                    name="role"
                    value={role}
                    required
                    disabled
                    onChange={(e) => setRole(e.target.value)}
                    />
                </div>
            </div>
        </div>
        <div className="profilePermissions">
            <h4>Profile permissions</h4>
            <div className="profilePerms">
                <div className="profileCRUD">
                    <span><h4>Permissions</h4></span>
                    <span><h4>Read</h4></span>
                    <span><h4>Create</h4></span>
                    <span><h4>Update</h4></span>
                    <span><h4>Delete</h4></span>
                </div>
                <div className="permperms">
                    {Object.entries(perms).map(([title, arr], index) => {
                      return (
                        <div className="toto">
                            <div className="permTit">
                                <span>{title}</span>
                                {Object.values(arr)[0]?.name === 'r' && (
                                    <span><i className="fas fa-check-circle"></i></span>
                                )}
                                {Object.values(arr)[0]?.name !== 'r' && (
                                    <span><i className="fas fa-times-circle"></i></span>
                                )}
                                {Object.values(arr)[1]?.name === 'c' && (
                                    <span><i className="fas fa-check-circle"></i></span>
                                )}
                                {Object.values(arr)[1]?.name !== 'c' && (
                                    <span><i className="fas fa-times-circle"></i></span>
                                )}
                                {Object.values(arr)[2]?.name === 'u' && (
                                    <span><i className="fas fa-check-circle"></i></span>
                                )}
                                {Object.values(arr)[2]?.name !== 'u' && (
                                    <span><i className="fas fa-times-circle"></i></span>
                                )}
                                {Object.values(arr)[3]?.name === 'd' && (
                                    <span><i className="fas fa-check-circle"></i></span>
                                )}
                                {Object.values(arr)[3]?.name !== 'd' && (
                                    <span><i className="fas fa-times-circle"></i></span>
                                )}
                            </div>
                        </div>
                      )})}
                </div>
            </div>
        </div>
    </div>
  )
}
export default Profile