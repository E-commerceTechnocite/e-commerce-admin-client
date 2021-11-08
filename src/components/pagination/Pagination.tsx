import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { useQuery } from '../../util/hook/useQuery'
import './pagination.scss'

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel
  uri?: string
  restUri?: string
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  uri,
  restUri,
}) => {
  const query = useQuery()
  const search = `${
    query.get('search')
      ? `&search=${query.get('search')}&order=${query.get('order')}`
      : ``
  }`
  const endUri = restUri ? restUri : ''
  return (
    <>
      {meta.maxPages > 1 && (
        <div className="pagination-component">
          {meta.prevPage && (
            <>
              <Link to={`${uri}1${endUri}${search}`}>
                <i className="fas fa-angle-double-left" />
              </Link>
              <Link to={`${uri}${meta.prevPage}${endUri}${search}`}>
                <i className="fas fa-angle-left" />
              </Link>
              {meta.prevPage - 1 > 0 && (
                <Link to={`${uri}${meta.prevPage - 1}${endUri}${search}`}>
                  {meta.prevPage - 1}
                </Link>
              )}
              <Link to={`${uri}${meta.prevPage}${endUri}${search}`}>
                {meta.prevPage}
              </Link>
            </>
          )}
          <Link
            to={`${uri}${meta.currentPage}${endUri}${search}`}
            className="current"
          >
            {meta.currentPage}
          </Link>
          {meta.nextPage && (
            <>
              <Link to={`${uri}${meta.nextPage}${endUri}${search}`}>
                {meta.nextPage}
              </Link>
              {meta.nextPage + 1 <= meta.maxPages && (
                <Link to={`${uri}${meta.nextPage + 1}${endUri}${search}`}>
                  {meta.nextPage + 1}
                </Link>
              )}
              <Link to={`${uri}${meta.nextPage}${endUri}${search}`}>
                <i className="fas fa-angle-right" />
              </Link>
              <Link to={`${uri}${meta.maxPages}${endUri}${search}`}>
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
