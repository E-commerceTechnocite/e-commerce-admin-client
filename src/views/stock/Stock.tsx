import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import Stocks from '../../components/stock/Stocks';

const Stock: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="stock">
            <Stocks/>
        </div>
    )
  }
  export default Stock;
