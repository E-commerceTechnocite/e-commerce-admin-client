import * as React from 'react'
import Granted from '../../Granted'
import './UsersListSkeleton.scss'

const UsersListSkeleton: React.FunctionComponent = () => {
  return (
    <div className="users-skeleton">
      <div className="top-container">
        <div className="search-skeleton"></div>
        <Granted permissions={['c:user']}>
          <div className="button-skeleton"></div>
        </Granted>
      </div>
      <div className="user-list">
        <div className="legend">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {[...Array(10)].map((param, index) => (
          <div className="user" key={index}>
            <span></span>
            <span></span>
            <span></span>
            <Granted permissions={['u:user']}>
              <span className="edit-skeleton"></span>
            </Granted>
            <Granted permissions={['d:user']}>
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
