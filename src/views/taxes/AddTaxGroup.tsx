import * as React from 'react'
import ActionTaxGroup from '../../components/taxGroup/ActionTaxGroup'

interface IAddTaxGroupProps {
  groupToParent: () => boolean
}

const AddTaxGroup: React.FunctionComponent<IAddTaxGroupProps> = (props) => {

  return (
    <div className="add-tax-group">
      <ActionTaxGroup/>
    </div>
  )
}

export default AddTaxGroup
