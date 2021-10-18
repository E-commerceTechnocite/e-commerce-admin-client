import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"
import Loading from "./loading/Loading"
import Pagination from "./pagination/Pagination"
import { PaginationMetadataModel } from "../models/pagination/pagination-metadata.model"
import { PaginationModel } from "../models/pagination/pagination.model"
import { config } from "../index"
import { sendRequest } from "../util/helpers/refresh"
import { http } from "../util/http"
import { CategoryModel } from "../models/category/category.model"

interface ICategoriesListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
}

const CategoriesList: React.FunctionComponent<ICategoriesListProps> = ({
  number,
  pagination,
  success,
}) => {
  const [categories, setCategories] = useState<CategoryModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  // Request to get the page of the category list
  const pageRequest = () =>
    http.get<PaginationModel<CategoryModel>>(
      `${config.api}/v1/product-category?page=${page}${number ? "&limit=" + number : ""}`,
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
    setCategories(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/product-category/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const deleteCategories = async (id: string, category: string) => {
    if (confirm(`Delete category: ${category}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      if (error) {
        console.log(error.message)
        history.push("/login")
      }
      setRefreshPage(!refreshPage)
    }
  }

  // Check if category has been added and if so displays a toast
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

  return (
    <div className="essai">
      <div className="roles">
        <div className="top-container">
          {pagination && (
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          )}
          <Link to="/categories/addcategories" className="action">
            New Category
          </Link>
          <div className={`toast-success ${!toast ? "hidden-fade" : ""}`}>
            {" "}
            <i className="fas fa-check" />
            Category Added
            <i className="fas fa-times" onClick={() => setToast(false)} />
          </div>
        </div>
        {!categories && !meta && <Loading />}
        {categories && meta && (
          <>
            <div className="role-list">
              <div className="legend">
                <span>Category</span>
                <span>Action</span>
              </div>
              {categories.map((category) => {
                return (
                  <div className="role" key={category.id}>
                    <span>{category.label}</span>
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="action"
                    >
                      Edit
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteCategories(category.id, category.label)}
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
  )
}

export default CategoriesList;