import * as React from "react"
import { ReactElement } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"
import SideBar from "../../components/SideBar"
import UpperBar from "../../components/UpperBar"

export const DashboardLayout = ({ children }): ReactElement => {
  return (
    <Router>
      <div>
        <SideBar />
        <UpperBar />
        <div></div> {/* Upperbar */}
        <nav></nav> {/* Sidebar */}
      </div>
      {children}
    </Router>
  )
}
