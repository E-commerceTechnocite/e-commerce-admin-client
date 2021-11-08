import * as React from 'react'
import Granted from '../../Granted'
import './CountrySkeleton.scss'

const CountrySkeleton: React.FunctionComponent = () => {
  return (
    <div className="country-skeleton">
      <div className="top">
        <Granted permissions={['c:country']}>
          <div className="button-skeleton"></div>
        </Granted>
      </div>
      <div className="country-list">
        <div className="legend">
          <span></span>
          <span></span>
        </div>
        <div className="content">
          {[...Array(5)].map((param, index) => (
            <div className="item" key={index}>
              <span></span>
              <span></span>
              <Granted permissions={['u:country']}>
                <span className="edit-skeleton"></span>
              </Granted>
              <Granted permissions={['d:country']}>
                <span className="delete-skeleton"></span>
              </Granted>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-skeleton"></div>
    </div>
  )
}

export default CountrySkeleton
