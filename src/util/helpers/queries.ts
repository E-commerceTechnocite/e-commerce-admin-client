import { useQuery } from '../hook/useQuery'

interface IParam {
  page: (page: string, init?: number) => string
  search: (search: string) => string
  order: (order: string) => string
  searchOrder: (search: string, order: string) => string
  q: (q: string) => string
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
    searchOrder: function (search: string, order: string): string {
      return query.get(search) && query.get(order)
        ? `&${search}=${query.get(search)}&${order}=${query.get(order)}`
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

export default param
