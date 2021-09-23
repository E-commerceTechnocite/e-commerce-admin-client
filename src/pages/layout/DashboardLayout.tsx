import * as React from "react";
import { ReactElement } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

export const DashboardLayout = ({ children }): ReactElement => {
  return (
    <>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </nav>
        {children}
      </Router>
    </>
  );
};
