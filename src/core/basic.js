import moment from "moment";

window.$ = (obj, way, zeroValue) => {
    var value;
    try {
        value = obj[way];
    } catch (error) {}

    if (value !== undefined)
        return value;

    return zeroValue;
};

export const dateFormat = {
    a: date => moment(date).format("ddd, DD MMMM YYYY"),
    b: date => moment(date).format("DD/MM/YYYY")
};
