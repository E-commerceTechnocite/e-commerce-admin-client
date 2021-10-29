import * as React from 'react'
import { useEffect, useState } from 'react'
import UsersList from '../components/users/UsersList'

interface IUsersProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Users: React.FunctionComponent<IUsersProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  useEffect(() => {
    if (props.location.state !== undefined) {
      console.log(props.location.state)
      setSuccess(props.location.state.success)
    }
  }, [])

  return (
    <>
      <UsersList number={10} pagination={true} success={success} />
    </>
  )
}
export default Users
