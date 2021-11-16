import * as React from 'react'
import './OrdersListSkeleton.scss'

const CustomersSkeleton: React.FunctionComponent = () => {
  return (
    <>
      <div className="customers-skeleton">
        <div className="top-container">
          <div className="search-skeleton"></div>
        </div>
        <div className="customer-list">
          <div className="legend">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            {[...Array(10)].map((param, index) => {
              return (
                <div className="customer-skeleton" key={index}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )
            })}
          </div>
          <div className="pagination-skeleton"></div>
        </div>
      </div>
    </>
  )
}

export default CustomersSkeleton
