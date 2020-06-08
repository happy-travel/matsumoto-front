import React, { useEffect } from 'react';
import { Route as ReactRoute } from 'react-router-dom';

const Route = (props) => {
    useEffect(() => {
        document.title = ( props.title ? (props.title + " – ") : "" ) + "Happytravel.com";
    });

    const { title, ...rest } = props;
    return <ReactRoute {...rest} />;
};

export default Route;