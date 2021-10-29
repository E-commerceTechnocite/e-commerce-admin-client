import * as React from 'react'
import Granted from '../../Granted'
import './TaxRuleSkeleton.scss'

const TaxRuleSkeleton: React.FunctionComponent = () => {
  return (
    <div className="tax-rule-skeleton">
      <div className="top-container">
        <div className="search-skeleton"></div>
        <Granted permissions={['c:tax-rule']}>
          <div className="button-skeleton"></div>
        </Granted>
      </div>
      <div className="tax-list">
        <div className="legend">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="content">
          {[...Array(5)].map(() => (
            <div className="item">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <Granted permissions={['u:tax-rule']}>
                <span className="edit-skeleton"></span>
              </Granted>
              <Granted permissions={['d:tax-rule']}>
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

export default TaxRuleSkeleton
