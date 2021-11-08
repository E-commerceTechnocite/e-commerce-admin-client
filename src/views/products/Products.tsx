import * as React from 'react'
import { useEffect, useState } from 'react'
import ProductsList from '../../components/product/ProductsList'

interface IProductsProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
    }
  }
}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
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
      <ProductsList number={10} pagination={true} success={success} successEdit={successEdit}/>
    </>
  )
}

export default Products
