import React, { useState } from "react";
import { getIn } from "formik";
import { FieldText, FieldSelect } from "components/form";
import { Loader } from "components/simple";

const Table = ({
   columns,
   list,
   textEmptyResult,
   textEmptyList,
   onRowClick,
   filter,
   sorters,
   searches,
   CustomFilter = null
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState(0);

    const searcher = (result) => {
        if (searchQuery) {
            result = result.filter(item => {
                if (typeof item != "object") {
                    return false;
                }
                const found = (values) => {
                    const queries = searchQuery.toLowerCase().split(" ").filter(v => v.length);
                    for (let i = 0; i < queries.length; i++) {
                        if (!values.some((v = "") =>
                            typeof v == "string" &&
                            v.toLowerCase().indexOf(queries[i]) >= 0
                        )) {
                            return false;
                        }
                    }
                    return true;
                };
                return found(searches(item));
            });
        }
        return result;
    };

    const sorter = (result) => {
        if (!sorters)
            return result;

        result.sort((a,b) => {
            const func = sorters[sortBy].sorter;
            let x = func(a);
            let y = func(b);

            if (x?.toLowerCase) x = x.toLowerCase();
            if (y?.toLowerCase) y = y.toLowerCase();
            if (x < y) return 1;
            if (x > y) return -1;
            return 0;
        });
        return result;
    };

    const getResult = () => {
        if (!list?.length)
            return [];
        let result = list.filter(() => true);
        if (filter)
            result = filter(result);
        result = sorter(result);
        result = searcher(result);
        return result;
    };

    const result = getResult();

    return (
        <div className="table">
            <div>
                <div className="controls">
                    <div className="left">
                        { sorters && <div className="form">
                            <FieldSelect
                                id="sorter"
                                label="Sort by"
                                value={sorters[sortBy].title}
                                setValue={value => setSortBy(value)}
                                options={sorters.map((item, index) => ({
                                    text: item.title,
                                    value: index
                                }))}
                            />
                        </div> }
                        { CustomFilter }
                    </div>
                    { searches && <div className="form search-wrap">
                        <FieldText
                            id="search"
                            label={"Search"}
                            placeholder="Enter Search Text"
                            onChange={(event) => setSearchQuery(event.target.value)}
                            onClear={() => setSearchQuery("")}
                            Icon={<span className="icon icon-search" />}
                            clearable
                            value={searchQuery}
                        />
                    </div> }
                </div>
                { list === null ?
                    <Loader /> :
                    ( !result?.length ?
                        <div className="empty">{list?.length ? textEmptyResult : textEmptyList || textEmptyResult}</div> :
                        <table className="the-table">
                            <tbody>
                            {result.map((row, index) => row && (
                                <tr
                                    onClick={onRowClick ? () => onRowClick(row) : null}
                                    className={__class(onRowClick, "clickable")}
                                    key={index}
                                >
                                    {columns.map((column, j) =>
                                        <td key={j}>
                                            <strong>{column.header}</strong>
                                            {typeof column.cell == "function" ?
                                                column.cell(row) :
                                                getIn(row, column.cell)
                                            }
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    );
};

export default Table;
