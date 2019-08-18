import moment from "moment";

export const dateFormat = {
    a: date => moment(date).format("ddd, DD MMMM YYYY"),
    b: date => moment(date).format("DD/MM/YYYY")
};
