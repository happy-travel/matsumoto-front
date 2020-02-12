import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";

import Pagination from "components/pagination";

function Table({ columns, data, className }) {
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
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
    );

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
