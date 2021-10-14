import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"

const Customers: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="customers">
            Customers
        </div>
    )
  }
  export default Customers;