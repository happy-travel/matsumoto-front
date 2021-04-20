import { API } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import { submitPaymentForm } from "../submitter";
import { $payment } from "stores";

export const payDirectByForm = (values) => {
    const directLinkCode = windowLocalStorage.get($payment.subject.referenceCode);

    return API.post({
        external_url: API.DIRECT_LINK_PAY.SIGN(directLinkCode),
        body: $payment.service,
        success: signature => submitPaymentForm(values, signature)
    });
};
