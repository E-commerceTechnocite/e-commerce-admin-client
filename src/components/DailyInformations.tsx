import * as React from 'react';

const DailyInformations: React.FunctionComponent = () => {
  return (
    <div className="daily-information"> 
        <div className="wrap">
            <div className="informationItem item1">
                <div className="informationContainer">
                    <h4>Sales</h4>
                    <p className="price">100 €</p>
                </div>
                <div>
                    <i className="fas fa-coins"></i>
                </div>
            </div>
            <div className="informationItem">
                <div className="informationContainer">
                    <h4>Profit</h4>
                    <p className="price">25 €</p>
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
            <div className="informationItem item4">
                <div className="informationContainer">
                    <h4>New Users</h4>
                    <p className="price">45</p>
                </div>
                <div>
                    <i className="fas fa-user-plus"></i>
                </div>
            </div>     
        </div>
    </div>
  );
};


export default DailyInformations;