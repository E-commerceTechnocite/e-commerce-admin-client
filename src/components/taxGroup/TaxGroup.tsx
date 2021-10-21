import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { sendRequest } from "../../util/helpers/refresh";
import { http } from "../../util/http";
import { config } from "../../index";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { TaxRuleGroupModel } from "../../models/product/tax-rule-group.model";
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model";
import Pagination from "../pagination/Pagination";
import { Link } from "react-router-dom";
import "./TaxGroup.scss";
import Granted from "../Granted";

interface ITaxGroupProps {
 successGroup?: boolean | undefined;
}

const TaxGroup: React.FunctionComponent<ITaxGroupProps> = ({
 successGroup,
}) => {
 const [group, setGroup] = useState<TaxRuleGroupModel[]>();
 const [meta, setMeta] = useState<PaginationMetadataModel>();
 const [page, setPage] = useState<number>(1);
 const [toast, setToast] = useState<boolean>(false);
 const [refreshPage, setRefreshPage] = useState(false);
 const history = useHistory();

 /**
  * Returns the get request for tax rule group
  * @returns request
  */
 const TaxRuleGroupRequest = () => {
  return http.get<PaginationModel<TaxRuleGroupModel>>(
   `${config.api}/v1/tax-rule-group?page=${page}&limit=5`,
   {
    headers: {
     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
   }
  );
 };
 /**
  * Sends the get request for tax rule group and sets the state values from response
  */
 const SubmitTaxRuleGroup = async () => {
  let { data, error } = await sendRequest(TaxRuleGroupRequest);
  if (error) {
   history.push("/login");
  }
  setGroup(data.data);
  setMeta(data.meta);
 };

 /**
  * Returns the delete request for the tax group select
  * @param id
  * @returns request
  */
 const deleteGroupRequest = (id: string) => {
  return http.delete(`${config.api}/v1/tax-rule-group/${id}`, null, {
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
   },
  });
 };
 /**
  * Sends the delete request for tax rule group
  * @param id
  * @param name
  */
 const deleteGroup = async (id: string, name: string) => {
  if (confirm(`Delete tax rule: ${name}?`)) {
   let { error } = await sendRequest(deleteGroupRequest, id);
   if (error) {
    history.push("/login");
   }
   setRefreshPage(!refreshPage);
  }
 };

 useEffect(() => {
  SubmitTaxRuleGroup().then();
 }, [page, refreshPage]);

 // Check if a tax group has been added and sends a confirmation toast
 useEffect(() => {
  if (successGroup === true) {
   setToast(true);
   setTimeout(() => {
    setToast(false);
   }, 10000);
  }
 }, [successGroup]);

 return (
  <>
   <div className="tax-group">
    <div className="top">
     <div className="search">
      <i className="fas fa-search"></i>
      <input type="text" placeholder="Search..." />
     </div>
     <Granted permissions={["c:tax-rule-group"]}>
      <Link to="/taxes/add-tax-group" className="action">
       New Group
      </Link>
     </Granted>
     <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
      {" "}
      <i className="fas fa-check" />
      Tax Group Added
      <i className="fas fa-times" onClick={() => setToast(false)} />
     </div>
    </div>
    {group && meta && (
     <>
      <div className="group-list">
       <div className="legend">
        <span>Name</span>
       </div>
       <div className="content">
        {group.map((group, index) => (
         <div className="item" key={index}>
          <span>{group.name}</span>
          <Granted permissions={["u:tax-rule-group"]}>
           <Link
            to={`/taxes/edit-tax-group/${group.id}`}
            className="action edit"
           >
            Edit
           </Link>
          </Granted>
          <Granted permissions={["d:tax-rule-group"]}>
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

export default TaxGroup;
