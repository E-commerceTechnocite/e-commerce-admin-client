import * as React from 'react'
import { useEffect, useState } from 'react'
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
import { useQuery } from '../../util/hook/useQuery'
import Granted from '../Granted'
import CategoriesListSkeleton from './skeleton/CategoriesListSkeleton'
import Legend from '../legend/legend'

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
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns get request for product categories
   * @returns request
   */
  const pageRequest = () =>
    http.get<PaginationModel<CategoryModel>>(
      `${config.api}/v1/product-category${
        query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('page')}${number ? '&limit=' + number : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )

  /**
   * Submits get request for product categories
   */
  const getCategory = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      if (error.statusCode === 405) {
        // TODO when feature available
        // redirect if search incorrect
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
    getCategory().then()
  }, [refreshPage, query.get('page'), query.get('search'), query.get('order')])

  return (
    <>
      {!categories && !meta && <CategoriesListSkeleton />}
      {categories && meta && (
        <div className="categories">
          <div className="top">
            {pagination && (
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
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
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Category Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>

          <div className="category-list">
            <div className="legend">
              <Legend uri={`/categories`} name={`Category`} search={`label`} />
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
              {categories.map((category) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="category"
                    key={category.id}
                  >
                    <span>{category.label}</span>
                    <Granted permissions={['u:product-category']}>
                      <Link
                        to={`/categories/edit/${category.id}?page=${query.get(
                          'page'
                        )}${
                          query.get('search') && query.get('order')
                            ? `&search=${query.get('search')}&order=${query.get(
                                'order'
                              )}`
                            : ``
                        }`}
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
            {pagination && <Pagination meta={meta} uri={`/categories?page=`} />}
          </div>
        </div>
      )}
    </>
  )
}

export default CategoriesList
