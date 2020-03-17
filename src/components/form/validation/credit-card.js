import * as Yup from "yup";
import valid from 'card-validator';

export default Yup.object().shape({
    card_number: Yup.string()
        .required("*")
        .test('is-card-number',
            'Credit Card number is not valid',
             value => valid.number(value).isValid),
    expiry_month: Yup.string()
        .required("*")
        .test('is-card-date-month',
            'Credit Card expiry month is not valid',
             value => valid.expirationMonth(value).isValid),
    expiry_year: Yup.string()
        .required("*")
        .test('is-card-date-year',
            'Credit Card expiry year is not valid',
             value => valid.expirationYear(value).isValid),
    card_security_code: Yup.string()
        .required("Credit Card secure code is not valid")
});
