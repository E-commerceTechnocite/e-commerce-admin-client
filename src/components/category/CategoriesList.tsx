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
import { useQuery } from '../../util/hook/useQuery'
import Granted from '../Granted'

interface ICategoriesListProps {
  number?: number
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const CategoriesList: React.FunctionComponent<ICategoriesListProps> = ({
  number,
  pagination,
  success,
  successEdit,
}) => {
  const [categories, setCategories] = useState<CategoryModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState(false)
  const [toastEdit, setToastEdit] = useState(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const [debouncedState, setDebouncedState] = useState("")
  const history = useHistory()

  // Request to get the page of the category list
  /**
   * Returns get request for product categories
   * @returns request
   */
  const pageRequest = () => {
    if(debouncedState === "") {
      return http.get<PaginationModel<CategoryModel>>(
        `${config.api}/v1/product-category?page=${query.get('page')}${
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
        `${config.api}/v1/product-category/search?q=${debouncedState}?page=${query.get('page')}${
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
  const query = useQuery()

  /*/**
   * Returns get request for product categories
   * @returns request
   */
  /*const pageRequest = () =>
    http.get<PaginationModel<CategoryModel>>(
      `${config.api}/v1/product-category?page=${query.get('page')}${
        number ? '&limit=' + number : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )*/

  /**
   * Submits get request for product categories
   */
  const getRoles = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
    setCategories(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request for specific product category
   * @param id
   * @returns request
   */
  const deleteRequest = (id: string) => {
    return http.delete(`${config.api}/v1/product-category/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }

  /**
   * Submits delete request for specific product category
   * @param id
   * @param category
   * @returns void
   */
  const deleteCategories = async (id: string, category: string) => {
    if (confirm(`Delete category: ${category}?`)) {
      let { error } = await sendRequest(deleteRequest, id)
      console.log(error)
      if (error) {
        if (error.message === 'Error 500 Internal Server Error') {
          alert(
            "You can't delete this category cause at least one product is assigned to this category"
          )
          return
        }
        history.push('/login')
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
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
    if (successEdit === true) {
      setToastEdit(true)
      setTimeout(() => {
        setToastEdit(false)
      }, 10000)
    }
  }, [success, successEdit])

  useEffect(() => {
    if (!query.get('page')) {
      history.push('/categories?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getRoles().then()
  }, [refreshPage, query.get('page'), debouncedState])

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
          <Granted permissions={['c:product-category']}>
            <Link to={`/categories/addcategories`} className="action">
              New Category
            </Link>
          </Granted>
          {success && (
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Category Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
            </div>
          )}
          {successEdit && (
            <div className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Category Edited
              <i className="fas fa-times" onClick={() => setToastEdit(false)} />
            </div>
          )}
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
                      <Granted permissions={['u:product-category']}>
                        <Link
                          to={`/categories/edit/${category.id}?page=${query.get(
                            'page'
                          )}`}
                          className="action edit"
                        >
                          Edit
                        </Link>
                      </Granted>
                      <Granted permissions={['d:product-category']}>
                        <button
                          className="delete"
                          onClick={() =>
                            deleteCategories(category.id, category.label)
                          }
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </Granted>
                    </motion.div>
                  )
                })}
              </motion.div>
              {pagination && (
                <Pagination meta={meta} uri={`/categories?page=`} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CategoriesList
