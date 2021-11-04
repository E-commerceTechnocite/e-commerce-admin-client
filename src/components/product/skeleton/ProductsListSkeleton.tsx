import * as React from 'react'
import { useEffect, useState } from 'react'
import Granted from '../../Granted'
import './ProductsListSkeleton.scss'

interface ProductsListSkeleton {
  number?: number
  pagination?: boolean
}

const ProductsListSkeleton: React.FunctionComponent<ProductsListSkeleton> = ({
  number,
  pagination,
}) => {
  const [listNnumber, setListNnumber] = useState<number>(10)
  useEffect(() => {
    setListNnumber(number)
  }, [])
  return (
    <>
      <div className="products-skeleton">
        <div className="top-container">
          {pagination && <div className="search-skeleton"></div>}
          <Granted permissions={['c:product']}>
            <div className="button-skeleton"></div>
          </Granted>
        </div>
        <div className="product-list">
          <div className="legend">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            {[...Array(listNnumber)].map((params, index) => (
              <div className="product" key={index}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <Granted permissions={['u:product']}>
                  <span className="edit-skeleton"></span>
                </Granted>
                <Granted permissions={['d:product']}>
                  <span className="delete-skeleton"></span>
                </Granted>
              </div>
            ))}
          </div>
          {pagination && <div className="pagination-skeleton"></div>}
        </div>
      </div>
    </>
  )
}

export default ProductsListSkeleton
