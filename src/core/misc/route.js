import React, { useEffect } from "react";
import { Route as ReactRoute } from "react-router-dom";
import tracker from "core/misc/tracker";

const Route = (props) => {
    useEffect(() => {
        document.title = ( props.title ? (props.title + " – ") : "" ) + "Happytravel.com";
        tracker();
    });

    const { title, ...rest } = props;
    return <ReactRoute {...rest} />;
};

export default Route;