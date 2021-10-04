import * as React from 'react';
import UsersTable from '../components/UsersTable'

const Users: React.FunctionComponent = () => {
    return (
      <>
        <div className="users">
          <div className="productButtonContainer">
            <div className="action">USER+</div> 
          </div>
          <br/>
          <div>Liste des utilisateurs</div>
          <br/>
          <UsersTable />
        </div>
      </>
    )
  }
  export default Users;