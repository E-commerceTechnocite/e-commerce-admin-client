import React from "react"
import { Route, Switch } from "react-router-dom"
import { Home } from "./views/Home"
import { Products } from "./views/Products"
import { DashboardLayout } from "./views/layout/DashboardLayout"

export const App = () => {
  return (
    <>
      <DashboardLayout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/products" component={Products} />
        </Switch>
      </DashboardLayout>
    </>
  )
}
