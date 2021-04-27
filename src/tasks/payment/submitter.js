import { decorate } from "simple";
import { formatExpiryDate } from "./decorator";
import { $payment } from "stores";

const formFormatter = (values) => ({
    card_holder_name: values.card_holder_name,
    card_security_code: values.card_security_code,
    card_number: decorate.removeNonDigits(values.card_number),
    expiry_date: formatExpiryDate(values),
    remember_me: values.remember_me ? "YES" : "NO"
});

const postVirtualForm = (path, values) => {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);
    for (let key in values)
        if (values.hasOwnProperty(key)) {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", values[key]);
            form.appendChild(hiddenField);
        }
    document.body.appendChild(form);
    form.submit();
};

export const submitPaymentForm = (values, signature) => {
    postVirtualForm($payment.requestUrl, {
        ...$payment.service,
        ...formFormatter(values),
        signature
    });
};