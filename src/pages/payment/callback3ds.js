import React from "react";
import PaymentResultPage from "./result";
import { getParams, API, session } from "core";

class Payment3DSecureCallbackPage extends PaymentResultPage {
    componentDidMount() {
        var params = getParams(),
            directLinkCode = session.get(params.merchant_reference);

        if (directLinkCode)
            this.setState({ directLinkCode });

        API.post({
            url: directLinkCode ? null : API.PAYMENTS_CALLBACK,
            external_url: directLinkCode ? API.DIRECT_LINK_PAY.PAY_CALLBACK(directLinkCode) : null,
            body: getParams(),
            after: (data, error) => this.callback(data, error, "After 3DSecure")
        });
    }
}

export default Payment3DSecureCallbackPage;
