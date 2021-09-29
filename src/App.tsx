import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { DashboardLayout } from "./views/layout/DashboardLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import Login from "./views/Login";
import AddProduct from "./views/AddProduct";

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <DashboardLayout>
              <Route exact path="/" component={Home} />
              <Route exact path="/products" component={Products} />
              <Route path="/products/add" component={AddProduct} />
            </DashboardLayout>
          </Switch>
        </Router>
      </Provider>
    </>
  );
};
