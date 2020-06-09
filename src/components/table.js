import React, { useEffect, useRef } from "react";
import { useTable, usePagination, useSortBy } from "react-table";

import Pagination from "components/pagination";

function Table(props) {
    const {
        columns,
        data,
        className,
        count,
        pageIndex: controlledPageIndex,
        pageSize: controlledPageSize,
        fetchData,
        manualPagination: controlledManualPagination
    } = props;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: controlledPageIndex, pageSize: controlledPageSize },
            manualPagination: controlledManualPagination,
            pageCount: Math.ceil(count / controlledPageSize),
        },
        useSortBy,
        usePagination,
    );
    const isFirstRun = useRef(true);

    // Listen for changes in pagination and use the state to fetch our new data
    useEffect(() => {
        if (isFirstRun.current) {
          isFirstRun.current = false;
          return;
        }
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize]);

    return (
        <>
            <table {...getTableProps()} className={className}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ?
                                    (column.isSortedDesc ? <span className={`icon icon-arrow-expand`} /> : <span className={`icon icon-arrow-expand-rotate`} /> )
                                    : <span className={`icon icon-arrows-expand`} />}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <Pagination
                previousPage={previousPage}
                canPreviousPage={canPreviousPage}
                pageCount={pageCount}
                gotoPage={gotoPage}
                pageIndex={pageIndex}
                canNextPage={canNextPage}
                nextPage={nextPage}
            />
        </>
    )
}

export default Table;
