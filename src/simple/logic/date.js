import { default as basicFormat } from "date-format";
import localeUtils from "tasks/utils/date-locale-utils";
import { windowLocalStorage } from "core/misc/window-storage";

//const parse = (date) => {
//   return basicFormat.parse("format", date);
//};

const getLocale = () => windowLocalStorage.get("locale");
const shortMonth = (val) => {
    if ("ar" === getLocale() || (val?.length < 5))
        return val;
    return val.substr(0, 3);
};

const dateFormat = (template, rawDate) => {
    let date = new Date(rawDate);
    return (
        basicFormat(template, date)
            .replace('DAY', localeUtils.formatWeekdayLong(date.getDay()))
            .replace('MTH', localeUtils.getMonths()[date.getMonth()])
            .replace('mth', shortMonth(localeUtils.getMonths()[date.getMonth()]))
            .replace('DD', date.getDate())
    );
};

const format = {
    api: date => dateFormat("yyyy-MM-ddT00:00:00Z", date),
    a: date => !date ? '' : dateFormat("DAY, dd MTH yyyy", date),
    c: date => !date ? '' : dateFormat("dd-MM-yyyy", date),
    e: date => !date ? '' : dateFormat("dd-MTH-yyyy", date),
    day: date => !date ? '' : dateFormat("MTH DD", date),
    shortDay: date => !date ? '' : dateFormat("mth DD", date),
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
    if (!date)
        return true;
    let result = new Date() > new Date(date);
    if (format.api(new Date()) == format.api(date))
        result = false;
    return result;
};

const parseDateRangeFromString = (text = "") => {
    const res = text
        .split(/[.,\/\- –]/)
        .filter(x => x);

    if (res.map(v => v.length).join(',') != "2,2,4,2,2,4")
        return null;

    const range = [
        new Date(+res[2], +res[1]-1, +res[0]),
        new Date(+res[5], +res[4]-1, +res[3])
    ];

    const isDateCorrect = (date) => {
        if (passed(date))
            return false;
        if (date.getFullYear() > new Date().getFullYear() + 5)
            return false;
        return true;
    };

    if (!isDateCorrect(range[0]) || !isDateCorrect(range[1]))
        return null;

    return range;
};

export default {
    format,
    addDay,
    addMonth,
    passed,
    parseDateRangeFromString
};