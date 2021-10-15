import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { DashboardLayout } from "./views/layout/DashboardLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import Login from "./views/Login";
import AddProduct from "./views/AddProduct";
import EditProduct from "./views/EditProduct";
import MediaLibrary from "./views/MediaLibrary";
import Users from "./views/Users";
import Roles from "./views/Roles";
import AddRoles from "./views/AddRoles";
import  NotFound from "./views/NotFound"
import ScrollToTop from "./components/ScrollToTop";
import { config } from "./index";

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router basename={config.basePath}>
          <ScrollToTop />
          <Switch>
            <Route path="/login" component={Login} />

            <DashboardLayout>
              <Route exact path="/" component={Home} />
              <Route exact path="/products" component={Products} />
              <Route exact path="/products/add" component={AddProduct} />

              <Route path="/products/edit/:slug" component={EditProduct} />
              <Route exact path="/medias" component={MediaLibrary} />
              <Route exact path="/users" component={Users} />
              <Route exact path="/roles" component={Roles} />
              <Route exact path="/roles/addroles" component={AddRoles} />
            </DashboardLayout>
            {/* <Route path="*" component={NotFound} /> */}
          </Switch>
        </Router>
      </Provider>
    </>
  );
};
