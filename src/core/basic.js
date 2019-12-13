import moment from "moment";

export const dateFormat = {
    a: date => !date ? '' : moment(date).format("ddd, DD MMMM YYYY"),
    b: date => !date ? '' : moment(date).format("DD/MM/YYYY"),
    c: date => !date ? '' : moment(date).format("DD.MM.YYYY"),
    d: date => !date ? '' : moment(date).format("ddd, DD MMM, YYYY")
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

export const plural = (t, value, word) => value + " " + t(word, {count: parseInt(value)});

export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currencyCode, currencyOrObject.netTotal);
    return " " + (currencyOrObject || "") + " " + (value || 0).toFixed(2) + " ";
};

export const hotelStars = [, "OneStar", "TwoStars", "ThreeStars", "FourStars", "FiveStars"];

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

const easeInOutQuad = function (t, b, c, d) {
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

export const scrollTo = (element, to, duration = 600) => {
    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
        currentTime += increment;
        element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
};

