import * as React from 'react'
import { useEffect, useState } from 'react'
import { auth } from '../util/helpers/auth'
import { useHistory, useParams } from 'react-router'
import { http } from '../util/http'
import { config } from '../index'
import { sendRequest } from '../util/helpers/refresh'
import ProfileTextInput from '../components/profile/ProfileTextInput'


const Profile: React.FunctionComponent = () => {
  const [allPermissions, setAllPermissions] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState("")
  const [role, setRole] = useState('')
  const perms = []
  //const [permissions, setPermissions] = useState([])

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
      //history.push('/login') !!!!!!!!!!!!!!!!!!! A REGARDER !!!!!!!!!!!!!!!!!!!
    }
    setAllPermissions(data)
  }

  useEffect(() => {
    SubmitPermissions().then()
  }, [])

  useEffect(() => {
    setUsername(auth.decodedAccess.username)
    setEmail(auth.decodedAccess.email)
    setRole(auth.decodedAccess.roleName)
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
    perms[title].push(operation)
    //if (!permissions[title]) permissions[title] = []
    //setPermissions((permission) => [...permission, operation])
  })

  const render = (tab : string) => {
    const elements = ['r', 'c', 'u','d'];
    const items = []
    for(let i = 0; i < elements.length; i++) {
        if(tab.indexOf(elements[i]) !== -1) 
            items.push(<span><i className="fas fa-check-circle"></i></span>)
        else 
            items.push(<span><i className="fas fa-times-circle"></i></span>)
    }
    return ( <>
        {items}
      </>
    )
  }

  return (
    <div className="userProfile">
        <div className="photoProfile">
            <img 
            className="userPhoto"   
            src={`https://avatars.dicebear.com/api/initials/${username}p.svg`}
            />
        </div>
        <div className="informationProfile">
            <div>
                <h4>Profile informations</h4>
            </div>
            <div className="infos">
                <ProfileTextInput label="Username" information={username}/>
                <ProfileTextInput label="E-mail" information={email}/>
                <ProfileTextInput label="Role" information={role}/>
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
                <div className="scroll-permissions-list">
                    {Object.entries(perms).map(([title, array], index) => {
                      return (
                        <div className="permTit">
                            <span>{title}</span>
                            {render(array)}
                        </div>
                      )})}
                </div>
            </div>
        </div>
    </div>
  )
}
export default Profile