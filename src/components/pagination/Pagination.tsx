import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
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
  return (
    <>
      {meta.maxPages > 1 && (
        <div className="pagination-component">
          {meta.prevPage && (
            <>
              <Link to={`${uri}1${restUri ? restUri : ''}`}>
                <i className="fas fa-angle-double-left" />
              </Link>
              <Link to={`${uri}${meta.prevPage}${restUri ? restUri : ''}`}>
                <i className="fas fa-angle-left" />
              </Link>
              {meta.prevPage - 1 > 0 && (
                <Link
                  to={`${uri}${meta.prevPage - 1}${restUri ? restUri : ''}`}
                >
                  {meta.prevPage - 1}
                </Link>
              )}
              <Link to={`${uri}${meta.prevPage}${restUri ? restUri : ''}`}>
                {meta.prevPage}
              </Link>
            </>
          )}
          <Link
            to={`${uri}${meta.currentPage}${restUri ? restUri : ''}`}
            className="current"
          >
            {meta.currentPage}
          </Link>
          {meta.nextPage && (
            <>
              <Link to={`${uri}${meta.nextPage}${restUri ? restUri : ''}`}>
                {meta.nextPage}
              </Link>
              {meta.nextPage + 1 <= meta.maxPages && (
                <Link
                  to={`${uri}${meta.nextPage + 1}${restUri ? restUri : ''}`}
                >
                  {meta.nextPage + 1}
                </Link>
              )}
              <Link to={`${uri}${meta.nextPage + 1}${restUri ? restUri : ''}`}>
                <i className="fas fa-angle-right" />
              </Link>
              <Link to={`${uri}${meta.maxPages}${restUri ? restUri : ''}`}>
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
