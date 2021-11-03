import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import './pagination.scss'

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel
  uri?: string
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  uri,
}) => {
  return (
    <>
      {meta.maxPages > 1 && (
        <div className="pagination-component">
          {meta.prevPage && (
            <>
              <Link to={`${uri}1`}>
                <i className="fas fa-angle-double-left" />
              </Link>
              <Link to={`${uri}${meta.prevPage}`}>
                <i className="fas fa-angle-left" />
              </Link>
              {meta.prevPage - 1 > 0 && (
                <Link to={`${uri}${meta.prevPage - 1}`}>
                  {meta.prevPage - 1}
                </Link>
              )}
              <Link to={`${uri}${meta.prevPage}`}>{meta.prevPage}</Link>
            </>
          )}
          <Link to={`${uri}${meta.currentPage}`} className="current">
            {meta.currentPage}
          </Link>
          {meta.nextPage && (
            <>
              <Link to={`${uri}${meta.nextPage}`}>{meta.nextPage}</Link>
              {meta.nextPage + 1 <= meta.maxPages && (
                <Link to={`${uri}${meta.nextPage + 1}`}>
                  {meta.nextPage + 1}
                </Link>
              )}
              <Link to={`${uri}${meta.nextPage + 1}`}>
                <i className="fas fa-angle-right" />
              </Link>
              <Link to={`${uri}${meta.maxPages}`}>
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
