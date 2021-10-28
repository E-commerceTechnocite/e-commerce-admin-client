import * as React from 'react'
import { ReactElement } from 'react'
import SideBar from '../../components/SideBar'
import UpperBar from '../../components/UpperBar'

export const DashboardLayout = ({ children }): ReactElement => {
  return (
    <>
      <SideBar />
      <div className="container">
        <UpperBar />
        <div className="content">{children}</div>
      </div>
    </>
  )
}
