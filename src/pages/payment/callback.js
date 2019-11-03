import React from "react";
import PaymentResultPage from "./result";
import { dateFormat, price, getParams, API, session } from "core";

import { Dual } from "components/simple";

import store from "stores/accommodation-store";
import { Loader } from "components/simple";

class Payment3DSecureCallbackPage extends PaymentResultPage {
    componentDidMount() {
        var params = getParams(),
            paymentResult = {
                params,
                saved: params.remember_me == "YES"
            },
            directLinkCode = session.get(params.merchant_reference);

        if (directLinkCode)
            this.setState({ directLinkCode });

        API.post({
            url: directLinkCode ? null : API.PAYMENTS_CALLBACK,
            external_url: directLinkCode ? API.DIRECT_LINK_PAY.PAY_CALLBACK(directLinkCode) : null,
            body: getParams(),
            after: (data, error) => {
                paymentResult.result = {
                    status: data?.status,
                    error: error?.detail
                };
                store.setPaymentResult(paymentResult);
                this.setState({
                    redirectToConfirmationPage: true
                });
            }
        });
    }
}

export default Payment3DSecureCallbackPage;
