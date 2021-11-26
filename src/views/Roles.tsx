import * as React from 'react'
import { useEffect, useState } from 'react'
import RolesList from '../components/role/RolesList'

interface IRolesProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
    }
  }
}

const Roles: React.FunctionComponent<IRolesProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  const [successEdit, setSuccessEdit] = useState<boolean | undefined>()
  useEffect(() => {
    if (props.location.state !== undefined) {
      if (props.location.state.success) setSuccess(props.location.state.success)
      if (props.location.state.successEdit)
        setSuccessEdit(props.location.state.successEdit)
    }
  }, [])

  return (
    <>
      <RolesList pagination={true} success={success} successEdit={successEdit} />
    </>
  )
}
export default Roles
