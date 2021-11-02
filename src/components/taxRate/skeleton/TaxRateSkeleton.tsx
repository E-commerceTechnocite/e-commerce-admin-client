import * as React from 'react'
import Granted from '../../Granted'
import './TaxRateSkeleton.scss'

const TaxRateSkeleton: React.FunctionComponent = () => {
  return (
    <>
      <div className="tax-rate-skeleton">
        <div className="top-container">
          <Granted permissions={['c:tax']}>
            <div className="button-skeleton"></div>
          </Granted>
        </div>
        <div className="rate-list">
          <div className="legend">
            <span></span>
          </div>
          <div className="content">
            {[...Array(5)].map(() => (
              <div className="item">
                <span></span>
                <Granted permissions={['u:tax']}>
                  <span className="edit-skeleton"></span>
                </Granted>
                <Granted permissions={['d:tax']}>
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

export default TaxRateSkeleton
