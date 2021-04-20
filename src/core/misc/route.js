import React, { useEffect } from "react";
import { Route as ReactRoute } from "react-router-dom";
import tracker from "core/misc/tracker";

const routesWithSearch = [
    "/search",
    "/search/contract"
]; //todo: temporary workaround
const isWithSearch = (props) => routesWithSearch.includes(props.path);

const Route = (props) => {
    useEffect(() => {
        document.title = ( props.title ? (props.title + " – ") : "" ) + "Happytravel.com";
        window.scrollTo(0, 0);

        document.getElementById("app").className = (isWithSearch(props) ? "with-search" : "");
        tracker();
    });

    const { title, ...rest } = props;
    return <ReactRoute {...rest} />;
};

export default Route;