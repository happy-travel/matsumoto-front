import React from "react";
import settings from "settings";
import PaymentPage from "../payment";

import { session } from "core";

import { API } from "core";
import { Loader } from "components/simple";

class PaymentDirectLinkPage extends PaymentPage {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            direct: true,
            orderCode: null
        };
    }

    componentDidMount() {
        var orderCode = this.props.match.params.code;
        this.setState({ orderCode });
        API.get({
            external_url: API.DIRECT_LINK_PAY.SETTINGS,
            after: data => {
                this.setState({
                    service: {
                        ...this.state.service,
                        access_code         : data.accessCode,
                        merchant_identifier : data.merchantIdentifier,
                    },
                    RequestUrl: data.tokenizationUrl
                });
                API.post({
                    external_url: API.DIRECT_LINK_PAY.SIGN(orderCode),
                    body: {
                        merchant_reference: this.state.service.merchant_reference
                    },
                    after: data => {
                        this.setState({
                            service: {
                                ...this.state.service,
                                signature: data
                            }
                        })
                    }
                });
            }
        });
        API.get({
            external_url: API.DIRECT_LINK_PAY.GET_INFO(orderCode),
            after: result => {
                session.set(result.referenceCode, orderCode);
                this.setState({
                    amount: result.amount,
                    currency: result.currency,
                    comment: result.comment,
                    service: {
                        ...this.state.service,
                        return_url: settings.payment_callback_host + "/payment/result/" + result.referenceCode
                    }
                });
            }
        });
    }

}

export default PaymentDirectLinkPage;
