import React from "react";
import { getIn } from "formik";
import { FieldText, FieldSelect } from "components/form";
import { Loader } from "components/simple";

class Table extends React.Component {
    state = {
        search_query: "",
        sort_by: 0
    };

    searcher = (result) => {
        var { search_query } = this.state,
            { searches } = this.props;

        if (search_query) {
            result = result.filter(item => {
                if (typeof item != "object") {
                    return false;
                }
                var found = values => {
                    var queries = search_query.toLowerCase().split(" ").filter(v => v.length);
                    for (var i = 0; i < queries.length; i++)
                        if (!values.some((v = "", key) =>
                            typeof v == "string" &&
                            v.toLowerCase().indexOf(queries[i]) >= 0
                        ))
                            return false;
                    return true;
                };
                return found(searches(item));
            });
        }
        return result;
    };

    sorter = (result) => {
        var { sort_by } = this.state,
            { sorters } = this.props;

        if (!sorters)
            return result;

        result.sort((a,b) => {
            var func = sorters[sort_by].sorter,
                x = func(a),
                y = func(b);
            if (x?.toLowerCase) x = x.toLowerCase();
            if (y?.toLowerCase) y = y.toLowerCase();
            if (x < y) return 1;
            if (x > y) return -1;
            return 0;
        });
        return result;
    };

    getResult = () => {
        var {
            list,
            filter
        } = this.props;
        if (!list?.length)
            return [];
        var result = list.filter(() => true);
        if (filter)
            result = filter(result);
        result = this.sorter(result);
        result = this.searcher(result);
        return result;
    };

    render() {
        var {
            columns,
            list,

            textEmptyResult,
            textEmptyList,

            onRowClick,

            filter,
            sorters,
            searches,

            CustomFilter = null
        } = this.props;

        var {
            sort_by,
            search_query
        } = this.state;

        const result = this.getResult();

        return (
            <div className="table">
                <div>
                    <div className="controls">
                        <div className="left">
                            { sorters && <div className="form">
                                <FieldSelect
                                    id="sorter"
                                    label="Sort by"
                                    value={sorters[sort_by].title}
                                    setValue={value => this.setState({ sort_by: value })}
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
                                onChange={event => this.setState({ search_query: event.target.value })}
                                onClear={() => this.setState({ search_query: "" })}
                                Icon={<span className="icon icon-search" />}
                                clearable
                                value={search_query}
                            />
                        </div> }
                    </div>
                    {list === null ? <Loader /> :
                        (!result?.length ?
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
                        )}
                </div>
            </div>
        );
    }
}

export default Table;
