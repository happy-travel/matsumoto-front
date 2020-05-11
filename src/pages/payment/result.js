import React from "react";
import { observer } from "mobx-react";
import { getParams, API, session } from "core";
import FinalizePaymentPage from "./finalize";

@observer
class PaymentResultPage extends FinalizePaymentPage {
    callback(data, error, after3ds) {
        var params = getParams(),
            directLinkCode = session.get(params.merchant_reference);

        if (!after3ds && ("Secure3d" == data?.status)) {
            window.location.href = data.secure3d;
            return;
        }

        if (!directLinkCode)
            this.finalize(
                params.merchant_reference,
                data,
                error,
                params
            );
        else
            this.setState({
                redirectToConfirmationPage: true
            });

    }

    componentDidMount() {
        var bookingReference = this.props.match.params.ref,
            params = getParams(),
            directLinkCode = session.get(bookingReference);

        if (directLinkCode) {
            this.setState({ directLinkCode });
            API.post({
                external_url: API.DIRECT_LINK_PAY.PAY(directLinkCode),
                body: params.token_name,
                after: (data, error) => this.callback(data, error)
            });

            return;
        }

        var request = {
            referenceCode: bookingReference,
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
            after: (data, error) => this.callback(data, error)
        });
    }
}

export default PaymentResultPage;
