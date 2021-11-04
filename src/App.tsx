import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { DashboardLayout } from './views/layout/DashboardLayout'
import Home from './views/Home'
import Products from './views/products/Products'
import Login from './views/Login'
import AddProduct from './views/products/AddProduct'
import EditProduct from './views/products/EditProduct'
import MediaLibrary from './views/MediaLibrary'
import Users from './views/Users'
import Roles from './views/Roles'
import NotFound from './views/NotFound'
import ScrollToTop from './components/ScrollToTop'
import { config } from './index'
import Taxes from './views/taxes/Taxes'
import AddTaxRule from './views/taxes/AddTaxRule'
import Categories from './views/Categories'
import Customers from './views/customers/Customers'
import Orders from './views/Orders'
import Stock from './views/stock/Stock'
import EditStock from './views/stock/EditStock'
import AddTaxGroup from './views/taxes/AddTaxGroup'
import AddTaxRate from './views/taxes/AddTaxRate'
import AddCountry from './views/taxes/AddCountry'
import { GuardedRoute, GuardFunction, GuardProvider } from 'react-router-guards'
import { sendRequest } from './util/helpers/refresh'
import { http } from './util/http'
import { auth } from './util/helpers/auth'
import ActionUser from './components/users/ActionUser'
import ActionCategory from './components/category/ActionCategory'
import ActionRole from './components/role/ActionRole'
import Loading from './components/loading/Loading'

const loginCheck = () =>
  http.post(`${config.api}/v1/o-auth/check`, null, {
    headers: { ...auth.headers },
  })

const loginGuard: GuardFunction = async (to, from, next) => {
  if (!auth.access) {
    auth.clearSession()
    next.redirect('/login')
  }
  const { error } = await sendRequest(loginCheck)
  if (error) {
    next.redirect('/login')
  } else {
    next()
  }
}

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router basename={config.basePath}>
          <Switch>
            <Route path="/login" component={Login} />
            <GuardProvider guards={[loginGuard]} loading={Loading}>
              <DashboardLayout>
                <Switch>
                  <GuardedRoute exact path="/" component={Home} />
                  <GuardedRoute
                    exact
                    path="/products"
                    component={Products}
                  />
                  <GuardedRoute
                    exact
                    path="/products/add"
                    component={AddProduct}
                  />
                  <GuardedRoute
                    path="/products/edit/:slug"
                    component={EditProduct}
                  />
                  <GuardedRoute exact path="/medias" component={MediaLibrary} />
                  <GuardedRoute exact path="/users" component={Users} />
                  <GuardedRoute
                    exact
                    path="/users/addusers"
                    component={ActionUser}
                  />
                  <GuardedRoute
                    exact
                    path="/users/edit/:slug"
                    component={ActionUser}
                  />
                  <GuardedRoute exact path="/roles" component={Roles} />
                  <GuardedRoute
                    exact
                    path="/roles/addroles"
                    component={ActionRole}
                  />
                  <GuardedRoute
                    exact
                    path="/roles/edit/:slug"
                    component={ActionRole}
                  />
                  <GuardedRoute exact path="/taxes" component={Taxes} />
                  <GuardedRoute
                    exact
                    path="/taxes/add-tax-rule"
                    component={AddTaxRule}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/edit-tax-rule/:slug"
                    component={AddTaxRule}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/add-tax-group"
                    component={AddTaxGroup}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/edit-tax-group/:slug"
                    component={AddTaxGroup}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/add-tax-rate"
                    component={AddTaxRate}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/edit-tax-rate/:slug"
                    component={AddTaxRate}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/add-country"
                    component={AddCountry}
                  />
                  <GuardedRoute
                    exact
                    path="/taxes/edit-country/:slug"
                    component={AddCountry}
                  />
                  <GuardedRoute
                    exact
                    path="/categories"
                    component={Categories}
                  />
                  <GuardedRoute
                    exact
                    path="/categories/addcategories"
                    component={ActionCategory}
                  />
                  <GuardedRoute
                    exact
                    path="/categories/edit/:slug"
                    component={ActionCategory}
                  />
                  <GuardedRoute exact path="/customers" component={Customers} />
                  <GuardedRoute exact path="/orders" component={Orders} />
                  <GuardedRoute exact path="/stock" component={Stock} />
                  <GuardedRoute
                    exact
                    path="/stock/edit-stock/:slug"
                    component={EditStock}
                  />
                  <GuardedRoute path="/not-found" component={NotFound} />
                  <Redirect to="/not-found" />
                </Switch>
              </DashboardLayout>
            </GuardProvider>
          </Switch>
        </Router>
      </Provider>
    </>
  )
}
