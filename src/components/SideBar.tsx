import * as React from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { http } from "../util/http";
import { config } from "../index"

const SideBar: React.FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const isActive = (uri: string, exact = false): boolean => {
    return exact
      ? location.pathname === uri
      : location.pathname.startsWith(uri);
  };
  const logout = () => {
    const refresh_token = sessionStorage.getItem("refresh");
    const token = sessionStorage.getItem("token");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    http
      .post(`${config.api}/v1/o-auth/logout`, { refresh_token }, options)
      .then(({ error }) => {
        if (error) return console.error(error.message);
        sessionStorage.removeItem("refresh");
        sessionStorage.removeItem("token");
        history.push("/login");
      });
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">
          <h1>- - - - - - SHOPTYK - - - - - -</h1>
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
            <li className={`${isActive("/", true) ? "sidebar-active" : ""}`}>
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
            <li className={`${isActive("/medias") ? "sidebar-active" : ""}`}>
              <Link to="/medias">
                <span>
                  <i className="fas fa-image"></i>
                </span>
                Media library
                </Link>
            </li>
            <li className={`${isActive("/users") ? "sidebar-active" : ""}`}>
              <Link to="/users">
                <span>
                  <i className="fas fa-users"></i>
                </span>
                Users
              </Link>
            </li>
            <li className={`${isActive("/roles") ? "sidebar-active" : ""}`}>
              <Link to="/roles">
                <span>
                  <i className="fas fa-user-tag"></i>
                </span>
                Roles
              </Link>
            </li>
            <li className={`${isActive("/taxes") ? "sidebar-active" : ""}`}>
              <Link to="/taxes">
                <span>
                  <i className="fas fa-donate"></i>
                </span>
                Taxes
              </Link>
            </li>
            <li className={`${isActive("/categories") ? "sidebar-active" : ""}`}>
              <Link to="/categories">
                <span>
                  <i className="fas fa-list"></i>
                </span>
                Categories
              </Link>
            </li>
            <li className={`${isActive("/customers") ? "sidebar-active" : ""}`}>
              <Link to="/customers">
                <span>
                  <i className="fas fa-user-circle"></i>
                </span>
                Customers
              </Link>
            </li>
            <li className={`${isActive("/orders") ? "sidebar-active" : ""}`}>
              <Link to="/orders">
                <span>
                  <i className="fas fa-cart-arrow-down"></i>
                </span>
                Orders
              </Link>
            </li>
            <li className={`${isActive("/stock") ? "sidebar-active" : ""}`}>
              <Link to="/stock">
                <span>
                  <i className="fas fa-dolly"></i>
                </span>
                Stock
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
  );
};

export default SideBar;
