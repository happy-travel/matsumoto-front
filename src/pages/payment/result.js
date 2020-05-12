import React from "react";
import BasicPaymentPage from "./utils/processing";
import { getParams, API, session } from "core";

class PaymentResultPage extends BasicPaymentPage {
    constructor(props) {
        super(props);
        this.render = super.render.bind(this);
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
