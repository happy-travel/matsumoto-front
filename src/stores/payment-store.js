import { observable } from "mobx"
import { getParams } from "core";
import autosave from "core/misc/autosave";
import setter from "core/mobx/setter";
import { PAYMENT_METHODS } from "enum";

class PaymentStore {
    @observable
    subject = {
        price: null,
        referenceCode: null,
        previousPaymentMethod: null
    };

    @observable
    @setter
    paymentMethod = PAYMENT_METHODS.CARD;

    @observable
    paymentResult = {
        status: null,
        error: null
    };

    @observable
    @setter([])
    savedCards = [];

    @observable
    requestUrl;

    @observable
    service = {};

    @observable
    @setter(false)
    saveCreditCard = false;

    constructor() {
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
}

export default new PaymentStore();
