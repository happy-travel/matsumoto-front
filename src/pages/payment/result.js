import React from "react";
import { observer } from "mobx-react";
import { getParams, API } from "core";
import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";

@observer
class PaymentResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false
        };
    }

    componentDidMount() {
        var bookingReference = this.props.match.params.ref,
            params = getParams(),
            paymentResult = { params };

        API.post({
            url: API.CARDS_RESPONSE,
            body: params,
            after: data => {
                paymentResult.service = { signature: data };
            }
        });

        if ("YES" == params.remember_me)
            API.post({
                url: API.CARDS_RESPONSE,
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
                    }
                });

                if (!booking)
                    return;

                API.post({
                    url: API.PAYMENTS_COMMON,
                    body: {
                        amount: Math.trunc(booking.roomDetails[0].price.price),
                        currency: booking.currencyCode,
                        referenceCode: bookingReference,
                        token: params.token_name
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
        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader />;
    }
}

export default PaymentResultPage;
