import * as React from 'react'
import ActionTaxRate from '../../components/taxRate/ActionTaxRate'

interface IAddTaxRateProps {}

const AddTaxRate: React.FunctionComponent<IAddTaxRateProps> = (props) => {
  return (
    <div className="add-tax-rate">
      <ActionTaxRate />
    </div>
  )
}

export default AddTaxRate
