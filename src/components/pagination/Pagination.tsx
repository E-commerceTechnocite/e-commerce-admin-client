import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { useQuery } from '../../util/hook/useQuery'
import param from '../../util/helpers/queries'
import './pagination.scss'

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel
  uri?: string
  restUri?: string
  customSearch?: string
  customOrder?: string
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  uri,
  restUri,
  customSearch,
  customOrder,
}) => {
  const query = useQuery()
  const queries = param()
  const paramSearch = `${customSearch ? customSearch : 'search'}`
  const paramOrder = `${customOrder ? customOrder : 'order'}`
  const querySearch = `${paramSearch}=${query.get(`${paramSearch}`)}`
  const queryOrder = `${paramOrder}=${query.get(`${paramOrder}`)}`
  const search = `${
    query.get(paramSearch) &&
    query.get(paramOrder) &&
    (query.get(paramOrder) == 'ASC' || query.get(paramOrder) == 'DESC')
      ? `&${querySearch}&${queryOrder}`
      : ``
  }`
  const endUri = restUri ? restUri : ''
  return (
    <>
      {meta.maxPages > 1 && (
        <div className="pagination-component">
          {meta.prevPage && (
            <>
              <Link to={`${uri}1${endUri}${search}${queries.q('q')}`}>
                <i className="fas fa-angle-double-left" />
              </Link>
              <Link to={`${uri}${meta.prevPage}${endUri}${search}${queries.q('q')}`}>
                <i className="fas fa-angle-left" />
              </Link>
              {meta.prevPage - 1 > 0 && (
                <Link to={`${uri}${meta.prevPage - 1}${endUri}${search}${queries.q('q')}`}>
                  {meta.prevPage - 1}
                </Link>
              )}
              <Link to={`${uri}${meta.prevPage}${endUri}${search}${queries.q('q')}`}>
                {meta.prevPage}
              </Link>
            </>
          )}
          <Link
            to={`${uri}${meta.currentPage}${endUri}${search}${queries.q('q')}`}
            className="current"
          >
            {meta.currentPage}
          </Link>
          {meta.nextPage && (
            <>
              <Link to={`${uri}${meta.nextPage}${endUri}${search}${queries.q('q')}`}>
                {meta.nextPage}
              </Link>
              {meta.nextPage + 1 <= meta.maxPages && (
                <Link to={`${uri}${meta.nextPage + 1}${endUri}${search}${queries.q('q')}`}>
                  {meta.nextPage + 1}
                </Link>
              )}
              <Link to={`${uri}${meta.nextPage}${endUri}${search}${queries.q('q')}`}>
                <i className="fas fa-angle-right" />
              </Link>
              <Link to={`${uri}${meta.maxPages}${endUri}${search}${queries.q('q')}`}>
                <i className="fas fa-angle-double-right" />
              </Link>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Pagination
