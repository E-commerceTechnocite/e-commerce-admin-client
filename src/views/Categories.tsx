import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"

const Categories: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="categories">
            Categories
        </div>
    )
  }
  export default Categories;