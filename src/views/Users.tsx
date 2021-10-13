import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import UsersTable from '../components/UsersTable'

const Users: React.FunctionComponent = () => {
    const history = useHistory()
    const onClick = (e: React.MouseEvent): void => {
        history.push("/users/addusers")
    }
    return (
      <div className="users">
        <div className="productButtonContainer">
          <button className="action" onClick={onClick}>USER+</button> 
        </div>
        <br/>
        <h3>Users list</h3>
        <br/>
        <UsersTable />
      </div>
    )
  }
  export default Users;