import * as React from 'react'
import Granted from '../../Granted'
import './TaxGroupSkeleton.scss'

const TaxGroupSkeleton: React.FunctionComponent = () => {
  return (
    <>
      <div className="tax-group-skeleton">
        <div className="top-container">
          <div className="search-skeleton"></div>
          <Granted permissions={['c:tax-rule-group']}>
            <div className="button-skeleton"></div>
          </Granted>
        </div>
        <div className="group-list">
          <div className="legend">
            <span></span>
          </div>
          <div className="content">
            {[...Array(5)].map(() => (
              <div className="item">
                <span></span>
                <Granted permissions={['u:tax-rule-group']}>
                  <span className="edit-skeleton"></span>
                </Granted>
                <Granted permissions={['d:tax-rule-group']}>
                  <span className="delete-skeleton"></span>
                </Granted>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination-skeleton"></div>
      </div>
    </>
  )
}

export default TaxGroupSkeleton
