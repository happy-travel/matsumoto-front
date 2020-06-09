export const getParams = () => {
    var params = {},
        paramSplit = window.location.search.substr(1)?.split("&");
    for ( var i = 0; i < paramSplit?.length; i++ ) {
        var equalsIndex = paramSplit[i].indexOf("="),
            valueSplit = [paramSplit[i].slice(0,equalsIndex), paramSplit[i].slice(equalsIndex+1)];
        params[decodeURIComponent(valueSplit[0])] = decodeURIComponent(valueSplit?.[1]);
    }
    return params;
};
