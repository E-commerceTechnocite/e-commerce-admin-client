import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { CountryModel } from "../../models/product/country.model";
import { http } from "../../util/http";
import { config } from "../../index";
import { sendRequest } from "../../util/helpers/refresh";
import Pagination from "../pagination/Pagination";
import "./Country.scss";
import Granted from "../Granted";

interface ICountryProps {
 successCountry?: boolean | undefined;
}

const Country: React.FunctionComponent<ICountryProps> = ({
 successCountry,
}) => {
 const [page, setPage] = useState<number>(1);
 const [country, setCountry] = useState<CountryModel[]>();
 const [meta, setMeta] = useState<PaginationMetadataModel>();
 const [toast, setToast] = useState<boolean>(false);
 const history = useHistory();

 /**
  * Returns the get request for country
  * @returns request
  */
 const countryRequest = () => {
  return http.get<PaginationModel<CountryModel>>(
   `${config.api}/v1/country?page=${page}&limit=5`,
   {
    headers: {
     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
   }
  );
 };
 /**
  * Submits the get request for country and sets the state values from response
  */
 const submitCountry = async () => {
  let { data, error } = await sendRequest(countryRequest);
  if (error) {
   history.push("/login");
  }
  setCountry(data.data);
  setMeta(data.meta);
 };

 useEffect(() => {
  submitCountry().then();
 }, [page]);

 // Check if a country has been added and sends a confirmation toast
 useEffect(() => {
  if (successCountry === true) {
   setToast(true);
   setTimeout(() => {
    setToast(false);
   }, 10000);
  }
 }, [successCountry]);

 return (
  <>
   <div className="country">
    <div className="top">
     <div className="search">
      <i className="fas fa-search"></i>
      <input type="text" placeholder="Search..." />
     </div>
     <Granted permissions={["c:country"]}>
      <Link to="/taxes/add-country" className="action">
       New country
      </Link>
     </Granted>
     <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
      {" "}
      <i className="fas fa-check" />
      Country Added
      <i className="fas fa-times" onClick={() => setToast(false)} />
     </div>
    </div>
    {country && meta && (
     <>
      <div className="country-list">
       <div className="legend">
        <span>Country</span>
        <span>Code</span>
       </div>
       <div className="content">
        {country.map((country, index) => (
         <div className="item" key={index}>
          <span>{country.name}</span>
          <span>{country.code}</span>
          <Granted permissions={["u:country"]}>
           <Link
            to={`/taxes/edit-country/${country.id}`}
            className="action edit"
           >
            Edit
           </Link>
          </Granted>
          <Granted permissions={["d:country"]}>
           <button
            className="delete"
            onClick={() => alert('Feature not implemented yet.')}
           >
            <i className="fas fa-trash"></i>
           </button>{" "}
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

export default Country;
