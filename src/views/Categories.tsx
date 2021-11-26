import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router'
import CategoriesList from '../components/category/CategoriesList'

interface IRolesProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
    }
  }
}

const Categories: React.FunctionComponent<IRolesProps> = (props) => {
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
      <CategoriesList pagination={true} success={success} successEdit={successEdit}/>
    </>
  )
}
export default Categories
