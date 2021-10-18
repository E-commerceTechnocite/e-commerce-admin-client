import * as React from 'react';
import { useEffect, useState } from "react"
import RolesList from '../components/RolesList'

interface IRolesProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Roles: React.FunctionComponent<IRolesProps> = (props) => {
  const [success, setSuccess] = useState<boolean|undefined>()
  useEffect(() => {
    if (props.location.state !== undefined) {
      console.log(props.location.state)
      setSuccess(props.location.state.success)
    } else {
      console.log(undefined)
    }
    
  }, [])  
  
  return (
      <>
        <RolesList number={10} pagination={true} success={success}/>
      </>
    )
  }
  export default Roles;