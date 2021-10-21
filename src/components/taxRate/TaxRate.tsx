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

interface ITaxRateProps {}

const TaxRate: React.FunctionComponent<ITaxRateProps> = (props) => {
 const [page, setPage] = useState<number>(1);
 const [rate, setRate] = useState<TaxModel[]>();
 const [meta, setMeta] = useState<PaginationMetadataModel>();
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

 return (
  <>
   <div className="tax-rate">
    <div className="top">
     <div className="search">
      <i className="fas fa-search"></i>
      <input type="text" placeholder="Search..." />
     </div>
     <Link to="/taxes/add-tax-rate" className="action">
      New rate
     </Link>
     {/* <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
                        {" "}
                        <i className="fas fa-check" />
                        Tax Group Added
                        <i className="fas fa-times" onClick={() => setToast(false)} />
                    </div> */}
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
          <Link to={`/taxes/edit-tax-rate/${rate.id}`} className="action edit">
           Edit
          </Link>
          <button
           className="delete"
           // onClick={() => deleteGroup(rate.id, rate.name)}
          >
           <i className="fas fa-trash"></i>
          </button>
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
