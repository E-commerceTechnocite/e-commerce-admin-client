import * as React from 'react';
import { useEffect, useState } from "react"
import { useHistory, withRouter } from "react-router"
import CategoriesList from '../components/category/CategoriesList';

interface IRolesProps {
    location?: {
      state: {
        success?: boolean
      }
    }
  }
  
  const Categories: React.FunctionComponent<IRolesProps> = (props) => {
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
          <CategoriesList number={10} pagination={true} success={success}/>
        </>
      )
    }
  export default Categories;