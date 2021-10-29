import * as React from 'react'
import { useState } from 'react'
import './UsersListSkeleton.scss'

const UsersListSkeleton: React.FunctionComponent = () => {
  return (
    <div className="users-skeleton">
      <div className="top-container">
        <div className="search-skeleton"></div>
        <div className="button-skeleton"></div>
      </div>
      <div className="user-list">
        <div className="legend">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {[...Array(10)].map(() => (
          <div className="user">
            <span></span>
            <span></span>
            <span></span>
            <span className="edit-skeleton"></span>
            <span className="delete-skeleton"></span>
          </div>
        ))}
        <div className="pagination-skeleton"></div>
      </div>
    </div>
  )
}

export default UsersListSkeleton
