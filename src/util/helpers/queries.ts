import { useQuery } from '../hook/useQuery'

interface IParam {
  page: (page: string, init?: number) => string
  search: (search: string) => string
  order: (order: string) => string
  searchOrder: (search: string, order: string) => string
  q: (q: string) => string
}

interface IRequestParams {
  getOrderBy: (search: string, order: string) => string
  getPage: (page: string, q?: string) => string
  getQ: (q: string) => string
}

/**
 * Returns functions to get url query parameters
 * @returns {IParam}
 */
const param = (): IParam => {
  const query = useQuery()
  return {

    /**
     * Returns query param page
     * @param {string} page
     * @returns
     */
    page: function (page: string, init?: number): string {
      return query.get(page)
        ? init
          ? `?${page}=${query.get(page)}`
          : `&${page}=${query.get(page)}`
        : init
        ? `?${page}=1`
        : `&${page}=1`
    },

    /**
     * Returns query param search
     * @param {string} search
     * @returns
     */
    search: function (search: string): string {
      return query.get(search) ? `&${search}=${query.get(search)}` : ''
    },

    /**
     * Returns query param order
     * @param {string} order
     * @returns
     */
    order: function (order: string): string {
      return query.get(order) ? `&${order}=${query.get(order)}` : ''
    },

    /**
     * Returns query param search and order
     * @param {string} search 
     * @param {string} order 
     * @returns 
     */
    searchOrder: function(search: string, order: string): string {
      return query.get(search) && query.get(order) ? `&${search}=${query.get(search)}&${order}=${query.get(order)}`
      : ''
    },

    /**
     * Returns query param q
     * @param {string} q
     * @returns
     */
    q: function (q: string): string {
      return query.get(q) ? `&${q}=${query.get(q)}` : ''
    },
  }
}

/**
 * Returns functions to get queries for fetch request
 * @returns {IRequestParams}
 */
export const requestParams = (): IRequestParams => {
  const query = useQuery()

  return {
    /**
     * Returns orderBy and order query if search exists
     * @param {string} search
     * @param {string} order
     * @returns
     */
    getOrderBy: function (search: string, order: string): string {
      return query.get(search)
        ? `?orderBy=${query.get(search)}&order=${query.get(order)}&`
        : '?'
    },

    /**
     * Returns specific page request based on if q exists
     * @param {string} page
     * @param {string} search
     * @returns
     */
    getPage: function (page: string, q?: string): string {
      return query.get(q)
        ? query.get(page)
          ? `?page=${query.get(page)}`
          : '?page=1'
        : query.get(page)
        ? `page=${query.get(page)}`
        : 'page=1'
    },

    /**
     * Returns q if it exists
     * @param {string} search
     * @returns
     */
    getQ: function (q: string): string {
      return query.get(q) ? `&q=${query.get(q)}` : ''
    },
  }
}
export default param
