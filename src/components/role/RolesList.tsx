import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"
import Loading from "../loading/Loading"
import Pagination from "../pagination/Pagination"
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model"
import { PaginationModel } from "../../models/pagination/pagination.model"
import { config } from "../../index"
import { sendRequest } from "../../util/helpers/refresh"
import { http } from "../../util/http"
import { RoleModel } from "../../models/role/role.model"


interface IRolesListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const RolesList: React.FunctionComponent<IRolesListProps> = ({
  number,
  pagination,
  success,
}) => {
  const [roles, setRoles] = useState<RoleModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  // Request to get the page of the role list
  const pageRequest = () =>
    http.get<PaginationModel<RoleModel>>(
      `${config.api}/v1/role?page=${page}${number ? "&limit=" + number : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
  const getRoles = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      history.push("/login")
    }
    setRoles(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/role/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const deleteRoles = async (id: string, role: string) => {
    if (confirm(`Delete role: ${role}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        console.log(error.message)
        history.push("/login")
      }
      setRefreshPage(!refreshPage)
    }
  }

  // Check if role has been added and if so displays a toast
  useEffect(() => {
    console.log(success)
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  useEffect(() => {
    getRoles().then()
  }, [page, refreshPage])

  return (<>
    <div className="essai">
      <div className="roles">
        <div className="top-container">
          {pagination && (
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          )}
          <Link to="/roles/addroles" className="action">
            New Role
          </Link>
          <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
            {" "}
            <i className="fas fa-check" />
            Role Added
            <i className="fas fa-times" onClick={() => setToast(false)} />
          </div>
        </div>
        {!roles && !meta && <Loading />}
        {roles && meta && (
          <>
            <div className="role-list">
              <div className="legend">
                <span>Role</span>
                <span>Action</span>
              </div>
              {roles.map((role) => {
                return (
                  <div className="role" key={role.id}>
                    <span>{role.name}</span>
                    <Link
                      to={`/roles/edit/${role.id}`}
                      className="action"
                    >
                      Edit
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteRoles(role.id, role.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )
              })}
              {pagination && <Pagination meta={meta} pageSetter={setPage} />}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}

export default RolesList;
