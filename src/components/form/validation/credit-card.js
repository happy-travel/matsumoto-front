import * as Yup from "yup";
import valid from "card-validator";

export const creditCardValidator = Yup.object().shape({
    card_holder_name: Yup.mixed().when("remember_me", {
            is: true,
            then: Yup.string().required("Name is required to save a card"),
            otherwise: Yup.string(),
        }),
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
        .min(3, "Credit Card secure code is not valid")
});

export const savedCreditCardValidator = Yup.object().shape({
    card_security_code: Yup.string().required("*")
});
