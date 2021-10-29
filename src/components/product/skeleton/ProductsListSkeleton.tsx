import * as React from 'react'
import { useEffect, useState } from 'react'
import Granted from '../../Granted'
import './ProductsListSkeleton.scss'

interface ISkeletonProps {
  number?: number
  pagination?: boolean
}

const Skeleton: React.FunctionComponent<ISkeletonProps> = ({
  number,
  pagination,
}) => {
  const [listNnumber, setListNnumber] = useState<number>(10)
  useEffect(() => {
    setListNnumber(number)
    console.log(number)
    console.log(pagination)
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
            {[...Array(listNnumber)].map(() => (
              <div className="product">
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

export default Skeleton
