import * as React from 'react'
import Granted from '../../Granted'
import './StocksSkeleton.scss'

const ProductsListSkeleton: React.FunctionComponent = () => {
  return (
    <>
      <div className="stocks-skeleton">
        <div className="top-container">
          <div className="search-skeleton"></div>
          <Granted permissions={['c:product']}>
            <div className="button-skeleton"></div>
          </Granted>
        </div>
        <div className="stock-list">
          <div className="legend">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            {[...Array(10)].map((params, index) => (
              <div className="stock" key={index}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <Granted permissions={['u:product']}>
                  <span className="edit-skeleton"></span>
                </Granted>
              </div>
            ))}
          </div>
          <div className="pagination-skeleton"></div>
        </div>
      </div>
    </>
  )
}

export default ProductsListSkeleton
