import React from "react";
import settings from "settings";
import { API } from "core";
import { windowSessionStorage } from "core/misc/window-storage";
import { userAuthSetDirectPayment } from "core/auth";
import PaymentPage from "../payment";

class PaymentDirectLinkPage extends PaymentPage {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            direct: true,
            orderCode: null,
            loading: true
        };
    }

    componentDidMount() {
        var orderCode = this.props.match.params.code;
        this.setState({ order_code: orderCode });
        API.get({
            external_url: API.DIRECT_LINK_PAY.SETTINGS,
            after: data => {
                this.setState({
                    service: {
                        ...this.state.service,
                        access_code         : data.accessCode,
                        merchant_identifier : data.merchantIdentifier,
                    },
                    request_url: data.tokenizationUrl
                });
            }
        });
        API.get({
            external_url: API.DIRECT_LINK_PAY.GET_INFO(orderCode),
            after: result => {
                if (!result) {
                    this.setState({
                        loading: false
                    });
                    return;
                }
                windowSessionStorage.set(result.referenceCode, orderCode);
                this.setState({
                    loading: false,
                    amount: result.amount,
                    currency: result.currency,
                    comment: result.comment,
                    status: result.creditCardPaymentStatus,
                    service: {
                        ...this.state.service,
                        return_url: settings.payment_callback_host + "/payment/result/" + result.referenceCode
                    }
                });
            }
        });

        userAuthSetDirectPayment();
    }

}

export default PaymentDirectLinkPage;
