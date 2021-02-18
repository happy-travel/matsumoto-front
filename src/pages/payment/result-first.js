import React from "react";
import { getParams, API } from "core";
import { Loader } from "simple";
import { paymentCallback } from "tasks/payment/finalize";
import { directPaymentCallback } from "tasks/payment/direct/direct-finalize";
import { windowLocalStorage } from "core/misc/window-storage";

// todo: result-first and result-second is the same page but
//  at first :
//      service_command=TOKENIZATION
//  at second :
//      command=AUTHORIZATION

class PaymentResultPage extends React.Component {
    componentDidMount() {
        var referenceCode = this.props.match.params.ref,
            params = getParams(),
            directLinkCode = windowLocalStorage.get(referenceCode);

        if (directLinkCode) {
            API.post({
                external_url: API.DIRECT_LINK_PAY.PAY(directLinkCode),
                body: params.token_name,
                after: (data, error) => directPaymentCallback(data, error)
            });
            return;
        }

        if (!params.token_name) {
            var detail = "Payment processing error: No token received from payment system.";
            if (params.response_message)
                detail += " Details: " + params.response_message;

            paymentCallback(null, { detail });
            return;
        }

        var request = {
            referenceCode,
            token: params.token_name,
            isSaveCardNeeded: "YES" == params.remember_me
        };

        if (request.isSaveCardNeeded)
            request.cardInfo = {
                number: params.card_number,
                expirationDate: params.expiry_date,
                holderName: params.card_holder_name,
                ownerType: "Agent"
            };

        API.post({
            url: API.PAYMENTS_CARD_NEW,
            body: request,
            after: (data, error) => paymentCallback(data, error)
        });
    }

    render() {
        return (
            <>
                <Loader white page />
                { __devEnv &&
                    <div className="top-alert development">
                        <a href={("http://localhost:4000" + window.location.pathname + window.location.search)}>
                            Process to localhost
                        </a>
                    </div>
                }
            </>
        );
    }
}

export default PaymentResultPage;
