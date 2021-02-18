import { API } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import { submitPaymentForm } from "../submitter";
import paymentStore from "stores/payment-store";

export const payDirectByForm = (values) => {
    const directLinkCode = windowLocalStorage.get(paymentStore.subject.referenceCode);

    return API.post({
        external_url: API.DIRECT_LINK_PAY.SIGN(directLinkCode),
        body: paymentStore.service,
        success: signature => submitPaymentForm(values, signature)
    });
};
