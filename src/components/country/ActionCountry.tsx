import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { CountryModel } from "../../models/product/country.model";
import { http } from "../../util/http";
import { config } from "../../index";
import { sendRequest } from "../../util/helpers/refresh";
import Previous from "../previous/Previous";
import { Formik } from "formik";
import TextInput from "../inputs/TextInput";
import { countrySchema } from "../../util/validation/taxValidation";
import Granted from "../Granted";

interface IActionCountryProps {}

const ActionCountry: React.FunctionComponent<IActionCountryProps> = () => {
 const [initialValues, seInitialValues] = useState({ name: "", code: null });
 const [country, setCountry] = useState<CountryModel>();
 const params: { slug: string } = useParams();
 const history = useHistory();

 /**
  * Returns post or patch request for new country
  * @param data
  * @returns request
  */
 const countryPostRequest = (data: CountryModel) => {
  if (params.slug) {
   return http.patch(`${config.api}/v1/country/${params.slug}`, data, {
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
   });
  }
  return http.post(`${config.api}/v1/country`, data, {
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits the post request for new country
  * @param data
  */
 const submitCountry = async (data: CountryModel) => {
  let { error } = await sendRequest(countryPostRequest, data);
  if (error) {
   history.push("/login");
  }
  history.push({
   pathname: "/taxes",
   state: { successCountry: true },
  });
 };

 /**
  * Returns get request for country
  * @returns
  */
 const currentTaxRateRequest = () => {
  return http.get<CountryModel>(`${config.api}/v1/country/${params.slug}`, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits get request for country
  */
 const submitCurrentTaxRate = async () => {
  let { data, error } = await sendRequest(currentTaxRateRequest);
  if (error) {
   history.push("/login");
  }
  setCountry(data);
 };

 useEffect(() => {
  if (params.slug) {
   submitCurrentTaxRate().then();
  }
 }, [params.slug]);
 useEffect(() => {
  if (params.slug) {
   if (country) {
    console.log(country);
    seInitialValues({ name: country.name, code: country.code });
   }
  }
 }, [country]);

 return (
  <>
   <Previous />
   <div className="action-tax-rate">
    <Formik
     enableReinitialize
     initialValues={initialValues}
     validationSchema={countrySchema}
     onSubmit={(data) => {
      submitCountry(data);
     }}
    >
     {({ handleSubmit }) => {
      return (
       <>
        <form onSubmit={handleSubmit}>
         <TextInput name={"name"} label={"Name"} />
         <TextInput name={"code"} label={"Code"} />
         {!params.slug && (
          <Granted permissions={["c:country"]}>
           <button className="action">submit</button>
          </Granted>
         )}
         {params.slug && (
          <Granted permissions={["u:country"]}>
           <button className="action">submit</button>
          </Granted>
         )}
         {/* {submitError && (
                 <div className="global-error">{submitError}</div>
               )} */}
        </form>
       </>
      );
     }}
    </Formik>
   </div>
  </>
 );
};

export default ActionCountry;
