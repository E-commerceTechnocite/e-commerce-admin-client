import * as React from 'react';
import UsersTable from '../components/UsersTable'

const Users: React.FunctionComponent = () => {
    return (
      <div className="users">
        <div className="productButtonContainer">
          <button className="action">USER+</button> 
        </div>
        <br/>
        <h3>Users list</h3>
        <br/>
        <UsersTable />
      </div>
    )
  }
  export default Users;