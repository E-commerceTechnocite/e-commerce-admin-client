import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"

const Stock: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="Stock">
            STOCK
        </div>
    )
  }
  export default Stock;