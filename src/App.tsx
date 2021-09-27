import React from "react"
import { Route, Switch } from "react-router-dom"
import { store } from "./store/store"
import { Provider } from "react-redux"
import { DashboardLayout } from "./views/layout/DashboardLayout"
import Home  from "./views/Home"
import Products  from "./views/Products"
import Login from "./views/Login"

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <DashboardLayout>
          <Switch>
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Home} />
            <Route path="/products" component={Products} />
          </Switch>
        </DashboardLayout>
      </Provider>
    </>
  )
}
