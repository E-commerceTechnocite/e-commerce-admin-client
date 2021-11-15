import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import param from '../../util/helpers/queries'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import './pagination.scss'

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel
  uri?: string
  restUri?: string
  customSearch?: string
  customQ?: string
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  uri,
  restUri,
  customSearch,
  customQ,
}) => {
  const queries = param()
  const search = customSearch
    ? customSearch
    : queries.searchOrder('search', 'order')
  const q = customQ ? customQ : queries.q('q')
  const endUri = restUri ? restUri : ''
  return (
    <>
      {meta.maxPages > 1 && (
        <div className="pagination-component">
          {meta.prevPage && (
            <>
              <Link to={`${uri}1${endUri}${search}${q}`}>
                <i className="fas fa-angle-double-left" />
              </Link>
              <Link to={`${uri}${meta.prevPage}${endUri}${search}${q}`}>
                <i className="fas fa-angle-left" />
              </Link>
              {meta.prevPage - 1 > 0 && (
                <Link to={`${uri}${meta.prevPage - 1}${endUri}${search}${q}`}>
                  {meta.prevPage - 1}
                </Link>
              )}
              <Link to={`${uri}${meta.prevPage}${endUri}${search}${q}`}>
                {meta.prevPage}
              </Link>
            </>
          )}
          <Link
            to={`${uri}${meta.currentPage}${endUri}${search}${q}`}
            className="current"
          >
            {meta.currentPage}
          </Link>
          {meta.nextPage && (
            <>
              <Link to={`${uri}${meta.nextPage}${endUri}${search}${q}`}>
                {meta.nextPage}
              </Link>
              {meta.nextPage + 1 <= meta.maxPages && (
                <Link to={`${uri}${meta.nextPage + 1}${endUri}${search}${q}`}>
                  {meta.nextPage + 1}
                </Link>
              )}
              <Link to={`${uri}${meta.nextPage}${endUri}${search}${q}`}>
                <i className="fas fa-angle-right" />
              </Link>
              <Link to={`${uri}${meta.maxPages}${endUri}${search}${q}`}>
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
