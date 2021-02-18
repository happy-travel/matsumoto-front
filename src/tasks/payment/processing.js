import { API } from "core";
import { submitPaymentForm } from "./submitter";
import { paymentCallback } from "./finalize";
import paymentStore from "stores/payment-store";

export const payBySavedCard = (values, selectedCardId) => {
    paymentStore.setSaveCreditCard(false);
    return API.post({
        url: API.PAYMENTS_CARD_SAVED,
        body: {
            referenceCode: paymentStore.subject.referenceCode,
            cardId: selectedCardId,
            securityCode: values.card_security_code
        },
        after: (data, error) => paymentCallback(data, error)
    });
};

export const payByForm = (values) => {
    paymentStore.setSaveCreditCard(values.remember_me);
    return API.post({
        url: API.CARDS_SIGN,
        body: paymentStore.service,
        success: signature => submitPaymentForm(values, signature)
    });
};
