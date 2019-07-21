window.$ = (obj, way, zeroValue) => {
    var value;
    try {
        value = obj[way];
    } catch (error) {}

    if (value !== undefined)
        return value;

    return zeroValue;
};

window.setLS = (key, item) => {
    try {
        if (typeof window != 'undefined' && window.localStorage)
            window.localStorage.setItem(key, item)
    } catch (e) {}

};

window.getLS = (key) => {
    var result = null;
    try {
        if (typeof window != 'undefined' && window.localStorage)
            result = window.localStorage.getItem(key);
    } catch (e) {}
    return result;
};
