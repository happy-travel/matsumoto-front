import { default as dateFormat } from "date-format";

//todo : MONTHs and DAYs

//todo : format.parse

const format = {
    api: date => dateFormat("yyyy-MM-ddT00:00:00Z", new Date(date)),
    a: date => !date ? '' : dateFormat("DAY, dd MONTH yyyy", new Date(date)),
    c: date => !date ? '' : dateFormat("dd-MM-yyyy", new Date(date)),
    e: date => !date ? '' : dateFormat("dd-MONTH-yyyy", new Date(date))
};

const addMonth = (date, amount) => {
    let result = new Date(date),
        previous = result.getMonth();
    result.setMonth(previous+amount);
    return result;
};

const addDay = (date, amount) => {
    let result = new Date(date),
        previous = result.getDate();
    result.setDate(previous+amount);
    return result;
};

const passed = (date) => {
    let result = new Date() > new Date(date);
    if (format.api(new Date()) == format.api(date))
        result = false;
    return result;
};

export default {
    format,
    addDay,
    addMonth,
    passed
};