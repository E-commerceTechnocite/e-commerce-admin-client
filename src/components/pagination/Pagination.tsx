import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import './pagination.scss'

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel
  pageSetter: Dispatch<SetStateAction<number>>
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  pageSetter: setPage,
}) => {
  const prevPage = (minus: number = 0) => setPage(meta.prevPage - minus)
  const nextPage = (plus: number = 0) => setPage(meta.nextPage + plus)
  const firstPage = () => setPage(1)
  const lastPage = () => setPage(meta.maxPages)

  return (
    <div className="pagination">
      {meta.prevPage && (
        <>
          <button type="button" onClick={firstPage}>
            <i className="fas fa-chevron-double-left"></i>
          </button>
          <button type="button" onClick={() => prevPage()}>
            <i className="fas fa-chevron-left"></i>
          </button>
          {meta.prevPage - 1 > 0 && (
            <button type="button" onClick={() => prevPage(1)}>
              {meta.prevPage - 1}
            </button>
          )}
          <button type="button" onClick={() => prevPage()}>
            {meta.prevPage}
          </button>
        </>
      )}
      <button type="button" className="current">
        {meta.currentPage}
      </button>
      {meta.nextPage && (
        <>
          <button type="button" onClick={() => nextPage()}>
            {meta.nextPage}
          </button>
          {meta.nextPage + 1 <= meta.maxPages && (
            <button type="button" onClick={() => nextPage(1)}>
              {meta.nextPage + 1}
            </button>
          )}
          <button type="button" onClick={() => nextPage()}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <button type="button" onClick={lastPage}>
            <i className="fas fa-chevron-double-right"></i>
          </button>
        </>
      )}
    </div>
  )
}

export default Pagination
