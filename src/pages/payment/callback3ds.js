import React from "react";
import BasicPaymentPage from "./utils/processing";
import { getParams, API } from "core";
import { windowSessionStorage } from "core/misc/window-storage";

class Payment3DSecureCallbackPage extends BasicPaymentPage {
    constructor(props) {
        super(props);
        this.render = super.render.bind(this);
    }
    componentDidMount() {
        var params = getParams(),
            directLinkCode = windowSessionStorage.get(params.merchant_reference);

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
