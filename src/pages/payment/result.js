import React from "react";
import { observer } from "mobx-react";
import { getParams, API, session } from "core";
import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";
import UI from "stores/ui-store";
import { FORM_NAMES } from "components/form";

@observer
class PaymentResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            directLinkCode: null,
            redirectToConfirmationPage: false
        };
        this.callback = this.callback.bind(this);
    }

    callback(data, error, after3ds) {
        var params = getParams(),
            directLinkCode = session.get(params.merchant_reference);

        if (!after3ds && ("Secure3d" == data?.status)) {
            window.location.href = data.secure3d;
            return;
        }
        store.setPaymentResult({
            params: params,
            result: {
                status: data?.status,
                error: error?.detail || error?.title
            }
        });

        if (!directLinkCode)
            API.post({
                url: API.A_BOOKING_FINALIZE(params.merchant_reference),
                after: () => {
                    UI.dropFormCache(FORM_NAMES.BookingForm);
                    this.setState({
                        redirectToConfirmationPage: true
                    });
                }
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

        if ("YES" == params.remember_me)
            API.post({
                url: API.CARDS_COMMON,
                body: {
                    number: params.card_number,
                    expirationDate: params.expiry_date,
                    holderName: params.card_holder_name,
                    token: params.token_name,
                    referenceCode: params.access_code,
                    ownerType: "Customer"
                },
                after: () => {
                    // todo: Saved successfully user callback
                }
            });

        API.post({
            url: API.PAYMENTS_CARD_COMMON,
            body: {
                referenceCode: bookingReference,
                token: {
                    code: params.token_name,
                    type: "OneTime"
                }
            },
            after: (data, error) => this.callback(data, error)
        });
    }

    render() {
        if (this.state.directLinkCode && this.state.redirectToConfirmationPage)
            return <Redirect push to="/payment/confirmation" />;

        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader white page />;
    }
}

export default PaymentResultPage;
