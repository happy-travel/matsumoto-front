import moment from "moment";

export const dateFormat = {
    a: date => !date ? '' : moment(date).format("ddd, DD MMMM YYYY"),
    b: date => !date ? '' : moment(date).format("DD/MM/YYYY"),
    c: date => !date ? '' : moment(date).format("DD.MM.YYYY")
};

export const decorate = {
    cutFirstPart: (str, firstPart) => {
        if (!firstPart || !str)
            return '';
        if (str.slice(0, firstPart.length).toUpperCase() == firstPart.toUpperCase())
            return str.slice(firstPart.length, str.length);
        return '';
    }
};

export const price = (currency, value) => " " + (currency || "") + " " + (value || 0).toFixed(2) + " ";

export const hotelStars = [, "OneStar", "TwoStars", "ThreeStars", "FourStars", "FiveStars"];

export const getParams = () => {
    var params = {},
        paramSplit = window.location.search.substr(1)?.split("&");
    for ( var i = 0; i < paramSplit?.length; i++ ) {
        var valueSplit = paramSplit[i].split("=");
        params[decodeURIComponent(valueSplit[0])] = decodeURIComponent(valueSplit?.[1]);
    }
    return params;
};