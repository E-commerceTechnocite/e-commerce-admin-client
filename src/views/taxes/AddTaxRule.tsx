import * as React from 'react';
import ActionTaxRule from '../../components/taxRule/ActionTaxRule';

interface IAddTaxRuleProps {}

const AddTaxRule: React.FunctionComponent<IAddTaxRuleProps> = (props) => {
  return (
    <div className="add-tax-rule">
      <ActionTaxRule />
    </div>
  )
};

export default AddTaxRule;
