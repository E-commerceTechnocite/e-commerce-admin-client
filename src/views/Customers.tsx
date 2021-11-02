import * as React from 'react'
import { useEffect, useState } from 'react'

interface ICustomersProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Customers: React.FunctionComponent<ICustomersProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
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
      {//<CustomersList number={10} pagination={true} success={success} />
      }
    </>
  )
}
export default Customers
