import * as React from "react";
import { useEffect, useState } from "react";
import { http } from "../../util/http";
import { config } from "../../index";
import "./TaxRate.scss";
import { sendRequest } from "../../util/helpers/refresh";
import { useHistory } from "react-router";
import { TaxModel } from "../../models/product/tax.model";
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model";
import { PaginationModel } from "../../models/pagination/pagination.model";
import Pagination from "../pagination/Pagination";
import { Link } from "react-router-dom";
import Granted from "../Granted";

interface ITaxRateProps {
 successRate?: boolean | undefined;
}

const TaxRate: React.FunctionComponent<ITaxRateProps> = ({ successRate }) => {
 const [page, setPage] = useState<number>(1);
 const [rate, setRate] = useState<TaxModel[]>();
 const [meta, setMeta] = useState<PaginationMetadataModel>();
 const [toast, setToast] = useState<boolean>(false);
 const history = useHistory();

 /**
  * Returns the get request for tax rule rate
  * @returns request
  */
 const TaxRuleRateRequest = () => {
  return http.get<PaginationModel<TaxModel>>(
   `${config.api}/v1/tax?page=${page}&limit=5`,
   {
    headers: {
     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
   }
  );
 };
 /**
  * Submits the get request for tax rule rate and sets the state values from response
  */
 const SubmitTaxRateGroup = async () => {
  let { data, error } = await sendRequest(TaxRuleRateRequest);
  if (error) {
   history.push("/login");
  }
  setRate(data.data);
  setMeta(data.meta);
 };

 useEffect(() => {
  SubmitTaxRateGroup().then();
 }, [page]);

 // Check if a tax rate has been added and sends a confirmation toast
 useEffect(() => {
  if (successRate === true) {
   setToast(true);
   setTimeout(() => {
    setToast(false);
   }, 10000);
  }
 }, [successRate]);

 return (
  <>
   <div className="tax-rate">
    <div className="top">
     <div className="search">
      <i className="fas fa-search"></i>
      <input type="text" placeholder="Search..." />
     </div>
     <Granted permissions={["c:tax"]}>
      <Link to="/taxes/add-tax-rate" className="action">
       New rate
      </Link>
     </Granted>
     <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
      {" "}
      <i className="fas fa-check" />
      Tax Rate Added
      <i className="fas fa-times" onClick={() => setToast(false)} />
     </div>
    </div>
    {rate && meta && (
     <>
      <div className="rate-list">
       <div className="legend">
        <span>Rate</span>
       </div>
       <div className="content">
        {rate.map((rate, index) => (
         <div className="item" key={index}>
          <span>{rate.rate}%</span>
          <Granted permissions={["u:tax"]}>
           <Link to={`/taxes/edit-tax-rate/${rate.id}`} className="action edit">
            Edit
           </Link>
          </Granted>
          <Granted permissions={["d:tax"]}>
           <button
            className="delete"
            onClick={() => alert('Feature not implemented yet.')}
           >
            <i className="fas fa-trash"></i>
           </button>
          </Granted>
         </div>
        ))}
       </div>
      </div>
      <Pagination meta={meta} pageSetter={setPage} />
     </>
    )}
   </div>
  </>
 );
};

export default TaxRate;
