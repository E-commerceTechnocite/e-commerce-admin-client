import * as React from 'react'
import { useEffect, useState } from 'react'
import UsersList from '../components/users/UsersList'

interface IUsersProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
    }
  }
}

const Users: React.FunctionComponent<IUsersProps> = (props) => {
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
      <UsersList pagination={true} success={success} successEdit={successEdit} />
    </>
  )
}
export default Users
