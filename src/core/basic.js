window.$ = (obj, way, zeroValue) => {
    var value;
    try {
        value = obj[way];
    } catch (error) {}

    if (value !== undefined)
        return value;

    return zeroValue;
};