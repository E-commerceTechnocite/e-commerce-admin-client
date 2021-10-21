import * as React from "react";
import ActionCountry from "../../components/country/ActionCountry";

interface IAddCountryProps {}

const AddCountry: React.FunctionComponent<IAddCountryProps> = (props) => {
 return (
  <div className="add-country">
   <ActionCountry />
  </div>
 );
};

export default AddCountry;
