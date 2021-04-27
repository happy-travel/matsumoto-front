import { makeAutoObservable } from "mobx"
import { getParams } from "core";
import autosave from "core/misc/autosave";

class PaymentStore {
    subject = {
        price: null,
        referenceCode: null,
        previousPaymentMethod: null
    };
    paymentMethod = null;
    paymentResult = {
        status: null,
        error: null
    };
    savedCards = [];
    requestUrl;
    service = {};
    saveCreditCard = false;

    constructor() {
        makeAutoObservable(this);
        autosave(this, "_payment_store_cache");
    }

    setSubject(referenceCode, price, previousPaymentMethod) {
        this.subject = { referenceCode, price, previousPaymentMethod };
    }

    setPaymentResult(status, errorRaw) {
        const params = getParams();

        let error = errorRaw;
        if (errorRaw && typeof errorRaw == "object")
            error = errorRaw.detail || errorRaw.title;

        if (status == "Failed")
            error = error || "Failed";

        if (params.response_message && (params.response_message != "Success"))
            error = params?.response_code + ": " + params?.response_message;

        if (status == "Success")
            error = null;

        this.paymentResult = {
            status,
            error
        }
    }

    setService(service, returnUrl) {
        this.service = {
            service_command: "TOKENIZATION",
            merchant_reference: require("uuid/v4")(),
            language: "en",
            access_code: service.accessCode,
            merchant_identifier: service.merchantIdentifier,
            return_url: returnUrl
        };
        this.requestUrl = service.tokenizationUrl;
    }

    setPaymentMethod(values) { this.paymentMethod = values; }
    setSavedCards(values) { this.savedCards = values || [] }
    setSaveCreditCard(values) { this.saveCreditCard = values || false; }
}

export default new PaymentStore();
