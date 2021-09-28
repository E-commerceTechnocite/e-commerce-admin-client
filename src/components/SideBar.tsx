import * as React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { update } from "../store/reducer/authUpdate"

const SideBar: React.FunctionComponent = () => {
  const location = useLocation()
  // const dispatch = useDispatch()
  const isActive = (uri: string): boolean => {
    if (location.pathname === uri) return true
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className="search-bar">
        <div>
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..."/>
        </div>
      </div>
      <nav>
        <div >
          <ul>
            <li className={`${isActive("/") ? "sidebar-active" : ""}`}>
              <Link to="/">
                <span>
                  <i className="fas fa-tachometer-alt "></i>
                </span>
                Dashboard
              </Link>
            </li>
            <li className={`${isActive("/products") ? "sidebar-active" : ""}`}>
              <Link to="/products">
                <span>
                  <i className="fas fa-folder-open"></i>
                </span>
                Products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="">
              <a href="">
                <span>
                  <i className="fas fa-id-badge"></i>
                </span>
                Profile
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default SideBar
