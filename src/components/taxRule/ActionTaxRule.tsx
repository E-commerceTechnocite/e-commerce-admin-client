import * as React from "react";
import Previous from "../previous/Previous";
import { Formik, Field } from "formik";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { config } from "../../index";
import { http } from "../../util/http";
import { sendRequest } from "../../util/helpers/refresh";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { CountryModel } from "../../models/product/country.model";
import Select from "../inputs/Select";
import TextInput from "../inputs/TextInput";
import { TaxModel } from "../../models/product/tax.model";
import { TaxRuleGroupModel } from "../../models/product/tax-rule-group.model";
import { taxRuleSchema } from "../../util/validation/taxValidation";
import TextAreaInput from "../inputs/TextAreaInput";
import "./ActionTaxRule.scss";
import { TaxRuleModel } from "../../models/product/tax-rule.model";
import Granted from "../Granted";

interface IActionTaxRuleProps {}

interface InitialValues {
 taxRuleGroupId?: string;
 countryId: string;
 taxId: string;
 zipCode: string;
 behavior: number;
 description: string;
}

const ActionTaxRule: React.FunctionComponent<IActionTaxRuleProps> = () => {
 const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel[]>();
 const [tax, setTax] = useState<TaxModel[]>();
 const [country, setCountry] = useState<CountryModel[]>();
 const [submitError, setSubmitError] = useState<string>(null);
 const history = useHistory();
 const params: { slug: string } = useParams();
 const [initialValues, setInitialValues] = useState<InitialValues>();

 /**
  * Returns post or patch request for new tax rule
  * @param data
  * @returns request
  */
 const taxRulePostRequest = (data: TaxRuleModel) => {
  if (params.slug) {
   return http.patch(`${config.api}/v1/tax-rule/${params.slug}`, data, {
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
   });
  }
  return http.post(`${config.api}/v1/tax-rule`, data, {
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits the post request for new tax rue
  * @param data
  */
 const submitTaxRulePost = async (data: TaxRuleModel) => {
  setSubmitError(null);

  let { error } = await sendRequest(taxRulePostRequest, data);
  if (error) {
   if (error.statusCode === 400) {
    console.log();
    setSubmitError(
     "This tax rule already exists, change tax group or country."
    );
    return;
   }
   history.push("/login");
  }
  history.push({
   pathname: "/taxes",
   state: { success: true },
  });
 };

 /**
  * Returns get request for tax group
  * @returns
  */
 const taxRuleGroupRequest = () => {
  return http.get<TaxRuleGroupModel[]>(`${config.api}/v1/tax-rule-group/all`, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits get request for tax group
  */
 const submitTaxRuleGroup = async () => {
  let { data, error } = await sendRequest(taxRuleGroupRequest);
  if (error) {
   history.push("/login");
  }
  setTaxRuleGroup(data);
 };

 /**
  * Returns get request for tax rate
  * @returns
  */
 const taxRequest = () => {
  return http.get<TaxModel[]>(`${config.api}/v1/tax/all`, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits get request for tax rate
  */
 const submitTax = async () => {
  let { data, error } = await sendRequest(taxRequest);
  if (error) {
   history.push("/login");
  }
  setTax(data);
 };

 /**
  * Returns get request for country
  * @returns
  */
 const countryRequest = () => {
  return http.get<CountryModel[]>(`${config.api}/v1/country/all`, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Submits get request for country
  */
 const submitCountry = async () => {
  let { data, error } = await sendRequest(countryRequest);
  if (error) {
   history.push("/login");
  }
  setCountry(data);
 };

 useEffect(() => {
  submitCountry().then();
  submitTax().then();
  submitTaxRuleGroup().then();
 }, []);

 const currentTaxRequest = () => {
  return http.get<TaxRuleModel>(`${config.api}/v1/tax-rule/${params.slug}`, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 const SubmitCurrentTax = async () => {
  let { data, error } = await sendRequest(currentTaxRequest);
  if (error) {
   history.push("/login");
  }
  setInitialValues({
   taxRuleGroupId: data.taxRuleGroup.id,
   countryId: data.country.id,
   taxId: data.tax.id,
   zipCode: data.zipCode,
   behavior: 0,
   description: data.description,
  });
 };

 useEffect(() => {
  if (params.slug) {
   SubmitCurrentTax().then();
  } else {
   setInitialValues({
    taxRuleGroupId: "",
    countryId: "",
    taxId: "",
    zipCode: "",
    behavior: 0,
    description: "",
   });
  }
 }, [params.slug]);

 return (
  <>
   <Previous />

   {country && tax && taxRuleGroup && (
    <div className="action-tax-rule">
     <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={taxRuleSchema}
      onSubmit={(data) => {
       if (params.slug) {
        delete data.taxRuleGroupId;
        delete data.countryId;
       }
       submitTaxRulePost(data);
      }}
     >
      {({ handleSubmit }) => {
       return (
        <>
         <form onSubmit={handleSubmit}>
          {!params.slug && (
           <Select name={"countryId"} label={"Country"} options={country} />
          )}
          <Select name={"taxId"} label={"Tax"} options={tax} />
          {!params.slug && (
           <Select
            name={"taxRuleGroupId"}
            label={"Tax Group"}
            options={taxRuleGroup}
           />
          )}
          <TextInput name={"zipCode"} label={"Zip Code"} />
          <TextAreaInput name={"description"} label={"Description"} />
          {!params.slug && (
           <Granted permissions={["c:tax-rule"]}>
            <button className="action">submit</button>
           </Granted>
          )}
          {params.slug && (
           <Granted permissions={["u:tax-rule"]}>
            <button className="action">submit</button>
           </Granted>
          )}
          {submitError && <div className="global-error">{submitError}</div>}
         </form>
        </>
       );
      }}
     </Formik>
    </div>
   )}
  </>
 );
};

export default ActionTaxRule;
