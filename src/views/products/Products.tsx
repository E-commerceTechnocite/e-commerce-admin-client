import * as React from 'react'
import { useEffect, useState } from 'react'
import ProductsList from '../../components/product/ProductsList'

interface IProductsProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  useEffect(() => {
    if (props.location.state !== undefined) {
      setSuccess(props.location.state.success)
    }
  }, [])
  return (
    <>
      <ProductsList number={10} pagination={true} success={success} />
    </>
  )
}

export default Products
