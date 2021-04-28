export const getParams = () => {
    let params = {};
    const paramSplit = window.location.search.substr(1)?.split("&");

    for (let i = 0; i < paramSplit?.length; i++) {
        const equalsIndex = paramSplit[i].indexOf("=");
        const valueSplit = [paramSplit[i].slice(0,equalsIndex), paramSplit[i].slice(equalsIndex+1)];
        params[decodeURIComponent(valueSplit[0])] = decodeURIComponent(valueSplit?.[1]);
    }
    return params;
};
