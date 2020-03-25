import * as Yup from "yup";
import valid from 'card-validator';

export default Yup.object().shape({
    card_number: Yup.string()
        .required("*")
        .test('is-card-number',
            'Credit Card number is not valid',
             value => valid.number(value).isValid),
    expiry_date: Yup.string()
        .required("*")
        .test('is-card-date-month',
            'Credit Card expiry date is not valid',
             value => valid.expirationDate(value).isValid),
    card_security_code: Yup.string()
        .required("Credit Card secure code is not valid")
});
