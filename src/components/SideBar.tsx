import * as React from "react"

const SideBar: React.FunctionComponent = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <a href="{name 'DashboardHome'}">
          <h1>LOGO</h1>
        </a>
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
            <li className="{ 'sidebar-active' isRouteActive({name 'DashboardHome'}) }">
              <a href="{name 'DashboardHome'}">
                <span>
                  <i className="fas fa-tachometer-alt "></i>
                </span>
                Dashboard
              </a>
            </li>
            <li className="{ 'sidebar-active' isRouteActive({name 'Products'}) }">
              <a href="{name 'Products'}">
                <span>
                  <i className="fas fa-folder-open"></i>
                </span>
                Products
              </a>
            </li>
            <li className="{ 'sidebar-active' isRouteActive({name 'Billing'}) }">
              <a href="{name 'Billing'}">
                <span>
                  <i className="fas fa-file-invoice-dollar"></i>
                </span>
                Billing
              </a>
            </li>
            <li className="{ 'sidebar-active' isRouteActive({name 'Cushrefmers'}) }">
              <a href="{name 'Cushrefmers'}">
                <span>
                  <i className="fas fa-user"></i>
                </span>
                Cushrefmers
              </a>
            </li>
            <li className="{ 'sidebar-active' isRouteActive({name 'Shipping'}) }">
              <a href="{name 'Shipping'}">
                <span>
                  <i className="fas fa-dolly"></i>
                </span>
                Shipping
              </a>
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
