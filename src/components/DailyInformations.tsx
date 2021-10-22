import * as React from 'react'

const DailyInformations: React.FunctionComponent = () => {
  return (
    <div className="daily-information">
      <div className="informationItem">
        <div className="informationContainer">
          <h4>Sales</h4>
          <p className="price">10321351 €</p>
        </div>
        <div>
          <i className="fas fa-coins"></i>
        </div>
      </div>
      <div className="informationItem">
        <div className="informationContainer">
          <h4>Transaction</h4>
          <p className="price">658</p>
        </div>
        <div>
          <i className="fas fa-wallet"></i>
        </div>
      </div>
      <div className="informationItem">
        <div className="informationContainer">
          <h4>Users</h4>
          <p className="price">1345</p>
        </div>
        <div>
          <i className="fas fa-users"></i>
        </div>
      </div>
      <div className="informationItem">
        <div className="informationContainer">
          <h4>New Users</h4>
          <p className="price">45</p>
        </div>
        <div>
          <i className="fas fa-user-plus"></i>
        </div>
      </div>
    </div>
  )
}

export default DailyInformations
