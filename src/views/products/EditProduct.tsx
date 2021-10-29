import * as React from 'react'
import { useParams } from 'react-router'
import ProductForm from '../../components/product/ProductForm'

interface IEditProductProps {}

const EditProduct: React.FunctionComponent<IEditProductProps> = () => {
  const params: { slug: string } = useParams()
  return (
    <>
      <ProductForm submitButtonContent="Edit product" productId={params.slug} />
    </>
  )
}

export default EditProduct
