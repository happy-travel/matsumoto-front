import { default as basicFormat } from "date-format";
import localeUtils from "tasks/utils/date-locale-utils";

//todo : format.parse

const dateFormat = (template, rawDate) => {
    let date = new Date(rawDate);
    return (
        basicFormat(template, date)
            .replace('DAY', localeUtils.formatWeekdayLong(date.getDay()))
            .replace('MTH', localeUtils.getMonths()[date.getMonth()])
    );
};

const format = {
    api: date => dateFormat("yyyy-MM-ddT00:00:00Z", date),
    a: date => !date ? '' : dateFormat("DAY, dd MTH yyyy", date),
    c: date => !date ? '' : dateFormat("dd-MM-yyyy", date),
    e: date => !date ? '' : dateFormat("dd-MTH-yyyy", date)
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