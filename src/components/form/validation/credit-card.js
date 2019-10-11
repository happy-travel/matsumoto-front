import * as Yup from "yup";
import valid from 'card-validator';

export default Yup.object().shape({
    card_number: Yup.string()
        .test('is-card-number',
            'Credit Card number is not valid',
             value => valid.number(value).isValid)
        .required("*"),
    expiry_date: Yup.string()
        /* todo: .test('is-card-date',
            'Credit Card expiry date is not valid',
             value => valid.expirationDate(value).isValid) */
        .required("*"),
    card_security_code: Yup.string()
        .test('is-card-cvv',
            'Credit Card secure code is not valid',
             value => valid.cvv(value).isValid)
        .required("*"),
});
