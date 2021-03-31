import * as Yup from "yup";

export const transferBalanceValidator = Yup.object().shape({
    amount: Yup.string()
        .required("*"),
    currency: Yup.string()
        .required("*"),
});
