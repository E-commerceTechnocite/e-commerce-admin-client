import * as React from 'react';
import { useHistory } from "react-router"
import TaxRule from '../components/taxRule/TaxRule';

const Taxes: React.FunctionComponent = () => {
    const history = useHistory()
    return (
        <div className="taxes">
            <TaxRule />
        </div>
    )
  }
  export default Taxes;