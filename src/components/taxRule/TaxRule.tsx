import * as React from "react"
import { useEffect, useState } from "react"
import { http } from "../../util/http"
import { config } from "../../index"
import "./TaxRule.scss"
import { useHistory } from "react-router"
import { sendRequest } from "../../util/helpers/refresh"
import { TaxRuleModel } from "../../models/taxRule/taxRule.model"
import { PaginationModel } from "../../models/pagination/pagination.model"
import Loading from "../loading/Loading"
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model"
import Pagination from "../pagination/Pagination"
import { Link } from "react-router-dom"

interface ITaxRuleProps {}

const TaxRule: React.FunctionComponent<ITaxRuleProps> = () => {
  const [taxRule, setTaxRule] = useState<TaxRuleModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [refreshPage, setRefreshPage] = useState<boolean>(false)
  const history = useHistory()

  // Get request for taxRules
  const TaxRuleRequest = () => {
    return http.get<PaginationModel<TaxRuleModel>>(
      `${config.api}/tax-rule?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
  }
  const SubmitTaxRule = async () => {
    let { data, error } = await sendRequest(TaxRuleRequest)
    if (error) {
      history.push("/login")
    }
    setTaxRule(data.data)
    setMeta(data.meta)
  }

// Delete request for tax rule
  const deleteTaxRequest = (id: string) => {
    return http.delete(`${config.api}/tax-rule/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const deleteTax = async (id: string) => {
  let { error } = await sendRequest(deleteTaxRequest, id)
  if (error) {
    console.log(error.message)
    history.push("/login")
  }
  setRefreshPage(!refreshPage)
}

  // Call the requests before render
  useEffect(() => {
    SubmitTaxRule().then()
  }, [page, refreshPage])

  return (
    <div className="tax-rule">
      <div className="top">
        <div className="search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <Link to="/" className="action">
          New Tax
        </Link>
      </div>
      {!taxRule && !meta && <Loading />}
      {taxRule && meta && (
        <>
          <div className="tax-list">
            <div className="legend">
              <span>Name</span>
              <span>Rate</span>
              <span>Country</span>
              <span>Zip code</span>
              <span>Description</span>
            </div>
            <div className="content">
              {taxRule.map((tax) => {
              console.log(tax.id)
              return (
                <>
                  <div className="item" key={tax.id}>
                    <span>{tax.taxRuleGroup.name}</span>
                    <span>{tax.tax.rate}%</span>
                    <span>{tax.country.name}</span>
                    <span>{tax.zipCode}</span>
                    <span>
                      {tax.description.length >= 100
                        ? tax.description.substr(0, 50) + "..."
                        : tax.description}
                    </span>
                    <Link to={`/`} className="action edit">
                      Edit
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteTax(tax.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </>
              )})}
            </div>
          </div>
          <Pagination meta={meta} pageSetter={setPage} />
        </>
      )}
    </div>
  )
}

export default TaxRule
