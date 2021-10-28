import * as React from 'react'
import { FC } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { http } from '../util/http'
import { config } from '../index'
import { auth } from '../util/helpers/auth'
import Granted from './Granted'

const SideBar: React.FunctionComponent = () => {
  const location = useLocation()
  const history = useHistory()
  const isActive = (uri: string, exact = false): boolean => {
    return exact ? location.pathname === uri : location.pathname.startsWith(uri)
  }
  const logout = () => {
    const refresh_token = auth.refresh
    const options = {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    }
    http
      .post(`${config.api}/v1/o-auth/logout`, { refresh_token }, options)
      .then(({ error }) => {
        if (error) return console.error(error.message)
        auth.clearSession()
        history.push('/login')
      })
  }

  const NavLink: FC<{ uri: string; icon: string; name: string; exact?: boolean }> = ({
    children,
    uri,
    icon,
    name,
    exact = false,
  }) => (
    <li className={`${isActive(uri, exact) ? 'sidebar-active' : ''}`}>
      <Link to={uri} data-cy={name}>
        <span>
          <i className={icon} />
        </span>
        {children}
      </Link>
    </li>
  )

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/" >
          <h1>SHOPTYK</h1>
        </Link>
      </div>
      <div className="search-bar">
        <div>
          <i className="fas fa-search" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <nav>
        <div>
          <ul>
            <NavLink uri="/" icon="fas fa-tachometer-alt" name="dashboard" exact>
              Dashboard
            </NavLink>
            <Granted permissions={['r:product']}>
              <NavLink uri="/products" icon="fas fa-folder-open" name="products">
                Products
              </NavLink>
            </Granted>
            <Granted permissions={['r:file']}>
              <NavLink uri="/medias" icon="fas fa-image" name="media-library">
                Media library
              </NavLink>
            </Granted>
            <Granted permissions={['r:user']}>
              <NavLink uri="/users" icon="fas fa-users" name="users">
                Users
              </NavLink>
            </Granted>
            <Granted permissions={['r:role']}>
              <NavLink uri="/roles" icon="fas fa-user-tag" name="roles">
                Roles
              </NavLink>
            </Granted>
            <Granted
              permissions={[
                'r:tax',
                'r:tax-rule',
                'r:tax-rule-group',
                'r:country',
              ]}
            >
              <NavLink uri="/taxes" icon="fas fa-donate" name="taxes">
                Taxes
              </NavLink>
            </Granted>
            <Granted permissions={['r:product-category']}>
              <NavLink uri="/categories" icon="fas fa-list" name="categories">
                Categories
              </NavLink>
            </Granted>
            <Granted permissions={[]}>
              <NavLink uri="/customers" icon="fas fa-user-circle" name="customers">
                Customers
              </NavLink>
            </Granted>
            <Granted permissions={[]}>
              <NavLink uri="/orders" icon="fas fa-cart-arrow-down" name="orders">
                Orders
              </NavLink>
            </Granted>
            <Granted permissions={[]}>
              <NavLink uri="/stock" icon="fas fa-dolly" name="stock">
                Stock
              </NavLink>
            </Granted>
          </ul>
        </div>
        <div>
          <ul>
            <li className="">
              <a href="">
                <span>
                  <i className="fas fa-id-badge" />
                </span>
                Profile
              </a>
            </li>
            <li>
              <a href="#" onClick={logout}>
                <span>
                  <i className="fas fa-sign-out-alt" />
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
