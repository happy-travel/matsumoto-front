import React from "react";

export default function ({canPreviousPage, previousPage, gotoPage, pageCount, pageIndex, canNextPage, nextPage}) {
    return (<div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="pagination__arrow pagination__arrow__left">
            <span className={`icon ${canPreviousPage ? 'icon-arrow-left' : 'icon-arrow-left-disabled'}`}/>
            <span>Prev</span>
        </button>
        {Array(pageCount).fill(1).map((item, index) => <button
            onClick={() => gotoPage(index)}
            className={`pagination__pages${index === pageIndex ? ' pagination__pages__active' : ''}`}
        >
            {index + 1}
        </button>)}
        <button onClick={() => nextPage()} disabled={!canNextPage} className="pagination__arrow">
            <span>Next</span>
            <span className={`icon ${canNextPage ? 'icon-arrow-right' : 'icon-arrow-right-disabled'}`}/>
        </button>
    </div>);
}