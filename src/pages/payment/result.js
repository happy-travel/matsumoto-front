import React from "react";
import { observer } from "mobx-react";
import { getParams, API, session } from "core";
import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";

@observer
class PaymentResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            directLinkCode: null,
            redirectToConfirmationPage: false
        };
    }

    componentDidMount() {
        var bookingReference = this.props.match.params.ref,
            params = getParams(),
            paymentResult = { params },
            directLinkCode = session.get(bookingReference);

        if (directLinkCode) {
            this.setState({ directLinkCode });
            API.post({
                external_url: API.DIRECT_LINK_PAY.PAY(directLinkCode),
                body: params.token_name,
                after: (data, error) => {
                    if ("Secure3d" == data?.status) {
                        window.location.href = data.secure3d;
                        return;
                    }
                    paymentResult.result = {
                        status: data?.status,
                        error: error?.detail || error?.title
                    };
                    store.setPaymentResult(paymentResult);
                    this.setState({
                        redirectToConfirmationPage: true
                    });
                }
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
                    paymentResult.saved = true;
                }
            });

        API.get({
            url: API.ACCOMMODATION_BOOKING,
            after: (data) => {
                store.setUserBookingList(data);
                var booking = null;
                store.userBookingList.forEach(item => {
                    if (item.bookingDetails.referenceCode == bookingReference) {
                        booking = item.bookingDetails;
                        booking.currencyCode = item.serviceDetails.agreement.currencyCode;
                        booking.price = item.serviceDetails.agreement.price;
                    }
                });

                if (!booking)
                    return;

                API.post({
                    url: API.PAYMENTS_COMMON,
                    body: {
                        amount: booking.price.total,
                        currency: booking.currencyCode,
                        referenceCode: bookingReference,
                        token: {
                            code: params.token_name,
                            type: "OneTime"
                        }
                    },
                    after: (data, error) => {
                        if ("Secure3d" == data?.status) {
                            window.location.href = data.secure3d;
                            return;
                        }
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
        });
    }

    render() {
        if (this.state.directLinkCode && this.state.redirectToConfirmationPage)
            return <Redirect push to="/payment/confirmation" />;

        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader />;
    }
}

export default PaymentResultPage;
