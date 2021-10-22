import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { DashboardLayout } from './views/layout/DashboardLayout'
import Home from './views/Home'
import Products from './views/Products'
import Login from './views/Login'
import AddProduct from './views/AddProduct'
import EditProduct from './views/EditProduct'
import MediaLibrary from './views/MediaLibrary'
import Users from './views/Users'
import Roles from './views/Roles'
import AddRoles from './views/AddRoles'
import NotFound from './views/NotFound'
import ScrollToTop from './components/ScrollToTop'
import { config } from './index'
import AddUsers from './views/AddUsers'
import Taxes from './views/taxes/Taxes'
import AddTaxRule from './views/taxes/AddTaxRule'
import Categories from './views/Categories'
import Customers from './views/Customers'
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

const loginCheck = () =>
  http.post(`${config.api}/v1/o-auth/check`, null, {
    headers: { ...auth.headers },
  })

const loginGuard: GuardFunction = async (to, from, next) => {
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
          <ScrollToTop />
          <Switch>
            <Route path="/login" component={Login} />
            <GuardProvider guards={[loginGuard]}>
              <DashboardLayout>
                <Switch>
                  <GuardedRoute exact path="/" component={Home} />
                  <GuardedRoute exact path="/products" component={Products} />
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
                    component={AddUsers}
                  />
                  <GuardedRoute exact path="/roles" component={Roles} />
                  <GuardedRoute
                    exact
                    path="/roles/addroles"
                    component={AddRoles}
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
                  <GuardedRoute exact path="/customers" component={Customers} />
                  <GuardedRoute exact path="/orders" component={Orders} />
                  <GuardedRoute exact path="/stock" component={Stock} />
                  <GuardedRoute
                    exact
                    path="/taxes/edit-stock/:slug"
                    component={EditStock}
                  />
                  <GuardedRoute path="*" component={NotFound} />
                </Switch>
              </DashboardLayout>
            </GuardProvider>
          </Switch>
        </Router>
      </Provider>
    </>
  )
}
