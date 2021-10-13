import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { DashboardLayout } from "./views/layout/DashboardLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import Login from "./views/Login";
import AddProduct from "./views/AddProduct";
import MediaLibrary from "./views/MediaLibrary";
import Users from "./views/Users"
import Roles from "./views/Roles"
import AddRoles from "./views/AddRoles"
import AddUsers from "./views/AddUsers";

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
                <Route path="/medias" component={MediaLibrary} />
                <Route exact path="/users" component={Users} />
                <Route path="/users/addusers" component={AddUsers} />
                <Route exact path="/roles" component={Roles}/>
                <Route path="/roles/addroles" component={AddRoles} />
              </DashboardLayout>
            </Switch>
          </Router>
        </Provider>
    </>
  );
};
