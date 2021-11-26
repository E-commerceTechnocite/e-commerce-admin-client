import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import CategoriesListSkeleton from './skeleton/CategoriesListSkeleton'
import { CategoryModel } from '../../models/category/category.model'
import { useEffect, useState, useCallback } from 'react'
import { sendRequest } from '../../util/helpers/refresh'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { http } from '../../util/http'
import Legend from '../legend/legend'
import { config } from '../../index'
import Granted from '../Granted'
import * as React from 'react'
import './CategoriesList.scss'
import _ from 'lodash'
import Uri from '../../util/helpers/Uri'
import Toast from '../toast/Toast'

interface ICategoriesListProps {
  pagination?: boolean
  success?: boolean | undefined
  successEdit?: boolean | undefined
}

const CategoriesList: React.FunctionComponent<ICategoriesListProps> = ({
  pagination,
  success,
  successEdit,
}) => {
  const [searchCategory, setSearchCategory] = useState<string>()
  const [categories, setCategories] = useState<CategoryModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns get request for product categories
   * @returns request
   */
  const pageRequest = () => {
    const url = !query.get('q')
      ? new Uri('/v1/product-category')
      : new Uri('/v1/product-category/search')
    url
      .setQuery('page', query.get('page') ? query.get('page') : '1')
      .setQuery('orderBy', query.get('search'))
      .setQuery('order', query.get('order'))
      .setQuery('q', query.get('q'))

    return http.get<PaginationModel<CategoryModel>>(url.href, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Submits get request for product categories
   */
  const getCategory = async () => {
    let { data, error } = await sendRequest(pageRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/categories')
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
      headers: { ...auth.headers },
    })
  }

  /**
   * Submits delete request for specific product category
   * @param id
   * @param category
   * @returns void
   */
  const deleteCategories = async (id: string, category: string) => {
    if (confirm(`Delete category: ${category}?\n⚠️⚠️⚠️ It will automatically delete all the related products. ⚠️⚠️⚠️`)) {
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

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setSearchCategory(searchValue)
      history.push({
        pathname: '/categories',
        search: `?page=1&s=u${searchValue ? `&q=${searchValue}` : ''}`,
      })
    }, 500),
    []
  )


  useEffect(() => {
    if (!query.get('page')) {
      history.push('/categories?page=1&s=u')
      return
    }
    if (query.get('s')) window.scrollTo(0, 0)
    getCategory().then()
  }, [
    refreshPage,
    query.get('page'),
    query.get('search'),
    query.get('order'),
    query.get('q'),
  ])

  return (
    <>
      {!categories && !meta && <CategoriesListSkeleton />}
      {categories && meta && (
        <div className="categories">
          <div className="top">
            {pagination && (
              <div className="search">
                <i
                  className="fas fa-search"
                  onClick={() => debounce(searchCategory)}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => debounce(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' ? debounce(e.currentTarget.value) : ''
                  }
                />
              </div>
            )}
            <Granted permissions={['c:product-category']}>
              <Link to={`/categories/addcategories`} className="action">
                New Category
              </Link>
            </Granted>
            {success && <Toast success={success} name={`Category`} />}
            {successEdit && (
              <Toast success={successEdit} name={`Category`} edit={true} />
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
              {categories.length === 0 && (
                <div className="notfound">
                  <label>Category not found</label>
                </div>
              )}
              {categories.map((category, index) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="category"
                    key={index}
                  >
                    <span>{category.label}</span>
                    <Granted permissions={['u:product-category']}>
                      <Link
                        to={`/categories/edit/${category.id}${queries.page(
                          'page', 1
                        )}${
                          query.get('search') && query.get('order')
                            ? `${queries.search('search')}${queries.order(
                                'order'
                              )}`
                            : ``
                        }${queries.q('q')}`}
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
