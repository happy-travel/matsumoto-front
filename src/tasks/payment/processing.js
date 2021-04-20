import { API } from "core";
import { submitPaymentForm } from "./submitter";
import { paymentCallback } from "./finalize";
import { $payment } from "stores";

export const payBySavedCard = (values, selectedCardId) => {
    $payment.setSaveCreditCard(false);
    return API.post({
        url: API.PAYMENTS_CARD_SAVED,
        body: {
            referenceCode: $payment.subject.referenceCode,
            cardId: selectedCardId,
            securityCode: values.card_security_code
        },
        after: (data, error) => paymentCallback(data, error)
    });
};

export const payByForm = (values) => {
    $payment.setSaveCreditCard(values.remember_me);
    return API.post({
        url: API.CARDS_SIGN,
        body: $payment.service,
        success: signature => submitPaymentForm(values, signature)
    });
};
