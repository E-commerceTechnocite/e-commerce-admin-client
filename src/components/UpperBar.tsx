import * as React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { auth } from '../util/helpers/auth'

const UpperBar: React.FunctionComponent = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [username, setUsername] = useState<string>("")
  const location = useLocation()
  const isFirstOrLast = (array: string[], index: number): boolean => {
    if (index === array.length - 1) return true
  }

  useEffect(() => {
    const crumb = location.pathname
    
    let treatedPath = crumb.split('/')
    for (let i = 0; i < treatedPath.length; i++) {
      treatedPath[i] =
      treatedPath[i].charAt(0).toUpperCase() + treatedPath[i].slice(1)
    }
    treatedPath.shift()
    if (treatedPath[0] === '')
      treatedPath[0] = treatedPath[0].replace('', 'Home')
    setBreadcrumbs(treatedPath)
    try {
    setUsername(auth.decodedAccess.username) // PEUT ETRE SUJET A ERREUR !
    } catch (e) {
    console.log("username error")
    setUsername("John Doe")
    }
  }, [location.pathname])

  return (
    <div className="upper-bar">
      <div className="breadcrumbs">
        {breadcrumbs.map((item, index) => (
          <span key={index}>
            {item}
            {!isFirstOrLast(breadcrumbs, index) ? (
              <i className="fas fa-chevron-right"></i>
            ) : (
              ''
            )}
          </span>
        ))}
      </div>
      <div className="user-info">
        <div className="user">
          <div></div>
          <div>
            <span>{username}</span>
          </div>
        </div>
        <div className="user-img">
          <img src={`https://avatars.dicebear.com/api/initials/${username}p.svg`} alt="" className="user-img2"/>
        </div>
      </div>
    </div>
  )
}

export default UpperBar
