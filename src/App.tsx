import React from "react"
import { Route, Switch } from "react-router-dom"
import { Home } from "./views/Home"
import { Products } from "./views/Products"
import { DashboardLayout } from "./views/layout/DashboardLayout"
import { store } from "./store/store"
import { Provider } from "react-redux"

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <DashboardLayout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/products" component={Products} />
          </Switch>
        </DashboardLayout>
      </Provider>
    </>
  )
}
