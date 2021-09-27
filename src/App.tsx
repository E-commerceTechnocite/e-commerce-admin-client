import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { store } from "./store/store"
import { Provider } from "react-redux"
import { DashboardLayout } from "./views/layout/DashboardLayout"
import Home from "./views/Home"
import Products from "./views/Products"
import Login from "./views/Login"
import {  useHistory } from "react-router"

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <DashboardLayout>
              <Route exact path="/" component={Home} />
              <Route path="/products" component={Products} />
            </DashboardLayout>
          </Switch>
        </Router>
      </Provider>
    </>
  )
}
