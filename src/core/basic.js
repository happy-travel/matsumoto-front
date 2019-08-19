import moment from "moment";

export const dateFormat = {
    a: date => moment(date).format("ddd, DD MMMM YYYY"),
    b: date => moment(date).format("DD/MM/YYYY")
};

export const decorate = {
    cutFirstPart: (str, firstPart) => {
        if (str.slice(0, firstPart.length).toUpperCase() == firstPart.toUpperCase())
            return str.slice(firstPart.length, str.length);
        return '';
    }
};
