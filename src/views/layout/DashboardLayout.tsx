import * as React from "react"
import { ReactElement } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"

export const DashboardLayout = ({ children }): ReactElement => {
  return (
    <Router>
      <div>
        <div></div> {/* Upperbar */}
        <nav></nav> {/* Sidebar */}
      </div>
      {children}
    </Router>
  )
}
