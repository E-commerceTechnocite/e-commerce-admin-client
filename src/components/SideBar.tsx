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

  const NavLink: FC<{ uri: string; icon: string; exact?: boolean }> = ({
    children,
    uri,
    icon,
    exact = false,
  }) => (
    <li className={`${isActive(uri, exact) ? 'sidebar-active' : ''}`}>
      <Link to={uri}>
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
        <Link to="/">
          <h1>Shoptyk</h1>
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
            <NavLink uri="/" icon="fas fa-tachometer-alt" exact>
              Dashboard
            </NavLink>
            <Granted permissions={['r:product']}>
              <NavLink uri="/products" icon="fas fa-folder-open">
                Products
              </NavLink>
            </Granted>
            <Granted permissions={['r:file']}>
              <NavLink uri="/medias" icon="fas fa-image">
                Media library
              </NavLink>
            </Granted>
            <Granted permissions={['r:product-category']}>
              <NavLink uri="/categories" icon="fas fa-list">
               Categories
              </NavLink>
            </Granted>
            <Granted permissions={['r:user']}>
              <NavLink uri="/users" icon="fas fa-users">
                Users
              </NavLink>
            </Granted>
            <Granted permissions={['r:role']}>
              <NavLink uri="/roles" icon="fas fa-user-tag">
                Roles
              </NavLink>
            </Granted>
            <Granted permissions={['r:customer']}>
              <NavLink uri="/customers" icon="fas fa-user-circle">
                Customers
              </NavLink>
            </Granted>
            <Granted permissions={[]}>
              <NavLink uri="/orders" icon="fas fa-cart-arrow-down">
                Orders
              </NavLink>
            </Granted>
            <Granted permissions={[
              'r:product',
            ]}>
              <NavLink uri="/stock" icon="fas fa-dolly">
                Stock
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
              <NavLink uri="/taxes" icon="fas fa-donate">
                Taxes
              </NavLink>
            </Granted>
          </ul>
        </div>
        <div>
          <ul>
            <Granted permissions={[]}>
              <NavLink uri="/profile" icon="fas fa-id-badge">
                Profile
              </NavLink>
            </Granted>
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
