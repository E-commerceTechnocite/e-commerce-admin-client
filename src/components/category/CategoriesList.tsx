import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Loading from '../loading/Loading'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { CategoryModel } from '../../models/category/category.model'
import './CategoriesList.scss'
import _ from 'lodash';

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
  const [debouncedState, setDebouncedState] = useState("");
  const history = useHistory()

  // Request to get the page of the category list
  const pageRequest = () => {
    if(debouncedState === "") {
      return http.get<PaginationModel<CategoryModel>>(
        `${config.api}/v1/product-category?page=${page}${
          number ? '&limit=' + number : ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      )
    } else {
      return http.get<PaginationModel<CategoryModel>>(
        `${config.api}/v1/product-category/search?q=${debouncedState}?page=${page}${
          number ? '&limit=' + number : ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      )
    } 
  }
  const getRoles = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      history.push('/login')
    }
    setCategories(data.data)
    setMeta(data.meta)
  }

  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/product-category/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  const deleteCategories = async (id: string, category: string) => {
    if (confirm(`Delete category: ${category}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      console.log(error)
      if (error) {
        console.log(error.message)
        //history.push("/login")
        alert('WARNING : AN ERROR OCCURED !')
        if (error.message === 'Error 500 Internal Server Error')
          alert(
            "You can't delete this category cause at least one product is assigned to this category"
          )
      }
      setRefreshPage(!refreshPage)
    }
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setDebouncedState(searchValue);
    }, 500),
    []
  );

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
  }, [page, refreshPage, debouncedState])

  return (
    <>
      <div className="category">
        <div className="top">
          {pagination && (
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." onChange={(e) => debounce(e.target.value)} />
            </div>
          )}
          <Link to="/categories/addcategories" className="action">
            New Category
          </Link>
          <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
            {' '}
            <i className="fas fa-check" />
            Category Added
            <i className="fas fa-times" onClick={() => setToast(false)} />
          </div>
        </div>
        {!categories && !meta && <Loading />}
        {categories && meta && (
          <>
            <div className="category-list">
              <div className="legend">
                <span>Category</span>
              </div>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.01,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {categories.length === 0 && <div className="notfound"><label>Category not found</label></div>}
                {categories && categories.map((category) => {
                  return (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className="role"
                      key={category.id}
                    >
                      <span>{category.label}</span>
                      <Link
                        to={`/categories/edit/${category.id}`}
                        className="action edit"
                      >
                        Edit
                      </Link>
                      <button
                        className="delete"
                        onClick={() =>
                          deleteCategories(category.id, category.label)
                        }
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </motion.div>
                  )
                })}
              </motion.div>
              {pagination && <Pagination meta={meta} pageSetter={setPage} />}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CategoriesList
