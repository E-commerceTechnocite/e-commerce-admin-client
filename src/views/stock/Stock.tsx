import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import Stocks from '../../components/stock/Stocks';
import './Stock.scss'

const Stock: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="stock">
            <Stocks/>
        </div>
    )
  }
  export default Stock;
