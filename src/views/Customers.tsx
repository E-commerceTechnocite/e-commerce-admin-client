import * as React from 'react';
import { useHistory, withRouter } from "react-router"

const Customers: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="customers">
            Customers
        </div>
    )
  }
  export default Customers;