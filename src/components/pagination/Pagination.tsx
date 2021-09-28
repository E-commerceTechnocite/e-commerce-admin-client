import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { PaginationMetadataModel } from "../../models/pagination/pagination-metadata.model";

export interface PaginationPropsInterface {
  meta: PaginationMetadataModel;
  pageSetter: Dispatch<SetStateAction<number>>;
}

const Pagination: FunctionComponent<PaginationPropsInterface> = ({
  meta,
  pageSetter: setPage,
}) => {
  const prevPage = (minus: number = 0) => setPage(meta.prevPage - minus);
  const nextPage = (plus: number = 0) => setPage(meta.nextPage + plus);
  const firstPage = () => setPage(1);
  const lastPage = () => setPage(meta.maxPages);

  return (
    <>
      <div style={{ display: "flex", justifyItems: "center", width: "100%" }}>
        {meta.prevPage && (
          <>
            <button onClick={firstPage}>&lt;&lt;</button>
            <button onClick={() => prevPage()}>&lt;</button>
            {meta.prevPage - 1 > 0 && (
              <button onClick={() => prevPage(1)}>{meta.prevPage - 1}</button>
            )}
            <button onClick={() => prevPage()}>{meta.prevPage}</button>
          </>
        )}
        <button disabled>{meta.currentPage}</button>
        {meta.nextPage && (
          <>
            <button onClick={() => nextPage()}>{meta.nextPage}</button>
            {meta.nextPage + 1 <= meta.maxPages && (
              <button onClick={() => nextPage(1)}>{meta.nextPage + 1}</button>
            )}
            <button onClick={() => nextPage()}>&gt;</button>
            <button onClick={lastPage}>&gt;&gt;</button>
          </>
        )}
      </div>
    </>
  );
};

export default Pagination;
