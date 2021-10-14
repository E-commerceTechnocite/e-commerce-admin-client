import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import AddRoles from './AddRoles';
import RolesTable from '../components/RolesTable';

const Roles: React.FunctionComponent = () => {
    const history = useHistory()
    const onClick = (e: React.MouseEvent): void => {
        history.push("/roles/addroles")
    }
    return (
        <div className="roles">
            <div className="productButtonContainer">
                <button className="action" onClick={onClick}>ROLE+</button> 
            </div>
            <br/>
            <h3>Role list</h3>
            <br/>
            <RolesTable />
        </div>
    )
  }
  export default Roles;