import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { http } from "../util/http"
import { domain } from "../util/environnement"

const SideBar: React.FunctionComponent = () => {
  const location = useLocation()
  const history = useHistory()
  const isActive = (uri: string): boolean => {
    if (location.pathname === uri) return true
  }
  const logout = () => {
    const refresh_token = sessionStorage.getItem("refresh")
    const token = sessionStorage.getItem("token")
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    http
      .post(`${domain}/v1/o-auth/logout`, { refresh_token }, options)
      .then(({ error }) => {
        if (error) return console.error(error.message)
        sessionStorage.removeItem("refresh")
        sessionStorage.removeItem("token")
        history.push("/login")
      })
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
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <nav>
        <div>
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
              <a href="#" onClick={logout}>
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
