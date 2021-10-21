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
import AddRoles from "./components/role/AddRoles";
import  NotFound from "./views/NotFound"
import ScrollToTop from "./components/ScrollToTop";
import { config } from "./index";
import Taxes from "./views/Taxes";
import Categories from "./views/Categories";
import Customers from "./views/Customers";
import Orders from "./views/Orders";
import Stock from "./views/Stock";
import EditUsers from "./views/EditUsers";
import EditRole from "./views/EditRole";
import EditCategories from "./views/EditCategories";
import ActionUser from "./components/users/ActionUser";
import ActionCategory from "./components/category/ActionCategory";

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
              <Route exact path="/products/edit/:slug" component={EditProduct} />
              <Route exact path="/medias" component={MediaLibrary} />
              <Route exact path="/users" component={Users} />
              <Route exact path="/users/addusers" component={ActionUser} />
              <Route exact path="/users/edit/:slug" component={EditUsers} />
              <Route exact path="/roles" component={Roles} />
              <Route exact path="/roles/addroles" component={AddRoles} />
              <Route exact path="/roles/edit/:slug" component={EditRole} />
              <Route exact path="/taxes" component={Taxes}/>
              <Route exact path="/categories" component={Categories}/>
              <Route exact path="/categories/addcategories" component={ActionCategory}/>
              <Route exact path="/categories/edit/:slug" component={EditCategories}/>
              <Route exact path="/customers" component={Customers}/>
              <Route exact path="/orders" component={Orders}/>
              <Route exact path="/stock" component={Stock}/>
            </DashboardLayout>
            {/* <Route path="*" component={NotFound} /> */}
          </Switch>
        </Router>
      </Provider>
    </>
  );
};
