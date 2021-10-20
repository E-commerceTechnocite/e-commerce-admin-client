import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { sendRequest } from "../../util/helpers/refresh"
import { http } from "../../util/http"
import { config } from "../../index"
import { PaginationModel } from "../../models/pagination/pagination.model"
import { TaxRuleGroupModel } from "../../models/product/tax-rule-group.model"
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model"
import Pagination from "../pagination/Pagination"
import { Link } from "react-router-dom"
import "./TaxGroup.scss"

interface ITaxGroupProps {
  successGroup?: boolean | undefined
}

const TaxGroup: React.FunctionComponent<ITaxGroupProps> = ({
  successGroup,
}) => {
  const [group, setGroup] = useState<TaxRuleGroupModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState<boolean>(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()

  const TaxRuleGroupRequest = () => {
    return http.get<PaginationModel<TaxRuleGroupModel>>(
      `${config.api}/v1/tax-rule-group?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
  }
  const SubmitTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(TaxRuleGroupRequest)
    if (error) {
      history.push("/login")
    }
    setGroup(data.data)
    setMeta(data.meta)
  }

  const deleteTaxRequest = (id: string) => {
    return http.delete(`${config.api}/v1/tax-rule-group/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const deleteGroup = async (id: string, name: string) => {
    if (confirm(`Delete tax rule: ${name}?`)) {
      let { error } = await sendRequest(deleteTaxRequest, id)
      if (error) {
        history.push("/login")
      }
      setRefreshPage(!refreshPage)
    }
  }

  useEffect(() => {
    SubmitTaxRuleGroup().then()
  }, [page, refreshPage])

  useEffect(() => {
    if (successGroup === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [successGroup])

  return (
    <>
      <div className="tax-group">
        <div className="top">
          <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <Link to="/taxes/add-tax-group" className="action">
            New Group
          </Link>
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
                {group.map((group) => (
                  <div className="item">
                    <span>{group.name}</span>
                    <Link
                      to={`/taxes/edit-tax-group/${group.id}`}
                      className="action edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteGroup(group.id, group.name)}
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
  )
}

export default TaxGroup
