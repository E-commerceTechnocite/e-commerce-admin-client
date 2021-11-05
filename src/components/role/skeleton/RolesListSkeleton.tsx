import * as React from 'react'
import Granted from '../../Granted'
import './RolesListSkeleton.scss'

const UsersListSkeleton: React.FunctionComponent = () => {
  return (
    <div className="roles-skeleton">
      <div className="top-container">
        <div className="search-skeleton"></div>
        <Granted permissions={['c:role']}>
          <div className="button-skeleton"></div>
        </Granted>
      </div>
      <div className="role-list">
        <div className="legend">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {[...Array(10)].map((param, index) => (
          <div className="role" key={index}>
            <span></span>
            <span></span>
            <span></span>
            <Granted permissions={['u:role']}>
              <span className="edit-skeleton"></span>
            </Granted>
            <Granted permissions={['d:role']}>
              <span className="delete-skeleton"></span>
            </Granted>
          </div>
        ))}
        <div className="pagination-skeleton"></div>
      </div>
    </div>
  )
}

export default UsersListSkeleton
