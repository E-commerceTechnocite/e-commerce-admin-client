import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { DashboardLayout } from "./pages/layout/DashboardLayout";

export const App = () => {
  return (
    <>
      <DashboardLayout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/products">
            <Products />
          </Route>
        </Switch>
      </DashboardLayout>
    </>
  );
};
