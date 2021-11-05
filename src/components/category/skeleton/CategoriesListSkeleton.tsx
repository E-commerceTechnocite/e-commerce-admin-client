import * as React from 'react'
import Granted from '../../Granted'
import './CategoriesListSkeleton.scss'

const CategoriesListSkeleton: React.FunctionComponent = () => {
  return (
    <div className="categories-skeleton">
      <div className="top-container">
        <div className="search-skeleton" ></div>
        <Granted permissions={['c:product-category']}>
          <div className="button-skeleton"></div>
        </Granted>
      </div>
      <div className="category-list">
        <div className="legend">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {[...Array(10)].map((param, index) => (
          <div className="category" key={index}>
            <span></span>
            <span></span>
            <span></span>
            <Granted permissions={['u:product-category']}>
              <span className="edit-skeleton"></span>
            </Granted>
            <Granted permissions={['d:product-category']}>
              <span className="delete-skeleton"></span>
            </Granted>
          </div>
        ))}
        <div className="pagination-skeleton"></div>
      </div>
    </div>
  )
}

export default CategoriesListSkeleton
