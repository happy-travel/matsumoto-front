import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API } from "core";

import { Dual } from "components/simple";

import store from "stores/accommodation-store";
import { Link } from "react-router-dom";

@observer
class PaymentResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            booking: {},
            result: {},
            saved: false
        };
    }

    componentDidMount() {
        var bookingReference = this.props.match.params.ref;

        if (!bookingReference) {
            this.setState({
                booking: { referenceCode: "Wrong result url, no booking reference found" },
                result: { error: "Booking not found"}
            });
            return;
        }

        var params = {};
        var paramSplit = window.location.search.substr(1)?.split("&");
        for ( var i = 0; i < paramSplit?.length; i++) {
            var valueSplit = paramSplit[i].split("=");
            params[valueSplit[0]] = valueSplit[1];
        }

        API.post({
            url: API.CARDS_RESPONSE,
            body: params,
            after: data => {
                this.setState({
                    service: {
                        ...this.state.service,
                        signature: data
                    }
                });
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
                after: () => this.setState({ saved: true })
            });


        API.get({
            url: API.ACCOMMODATION_BOOKING,
            after: (data) => {
                store.setUserBookingList(data);
                var booking = null;
                store.userBookingList.forEach(item => {
                    if (item.bookingDetails.referenceCode == bookingReference)
                        booking = item.bookingDetails;
                });

                if (!booking) {
                    this.setState({
                        booking: { referenceCode: "Not found" },
                        result: { error: "Booking not found"}
                    });
                    return;
                }
                this.setState({ booking });

                API.post({
                    url: API.PAYMENTS_COMMON,
                    body: {
                        amount: Math.trunc(booking.roomDetails[0].price.price),
                        currency: "USD", //todo: bind currency. 2 alternative currencies: "NotSpecified", "USD"
                        referenceCode: bookingReference,
                        token: params.token_name
                    },
                    after: (data, error) => {
                        this.setState({
                            result: {
                                status: data?.status,
                                error: error?.detail
                            }
                        });
                    }
                });


            }
        });

        this.setState({ params });
    }

render() {
    const { t } = useTranslation(),
          {
              params,
              booking,
              result,
              saved
          } = this.state,
          params_error = (params?.response_message != "Success");

    return (
        <div class="confirmation block">
            <section class="double-sections">
                <div class="middle-section">
                    <h2>
                        {t("Payment result")}
                    </h2>

                    <div class={"result-code" + (params_error ? " error" : "")}>
                        <div class="before">
                            { params_error ? <span class="icon icon-close white" /> : <span class="icon icon-white-check" /> }
                        </div>
                        <div class="dual">
                            <div class="first">
                                Card acceptance message: <strong>{params?.response_message}</strong>
                            </div>
                            <div class="second">
                                Response code: <strong>{params?.response_code}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong>{booking.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t("Price")}: <strong>{price("", booking.roomDetails?.[0]?.price.price)}</strong>
                            </div>
                        </div>
                    </div>

                    <div class={"result-code" + (result.error ? " error" : "")}>
                        { (result.status || result.error) && <div class="before">
                            { result.error ? <span class="icon icon-close white" /> : <span class="icon icon-white-check" /> }
                        </div> }
                        <div class="dual">
                            <div class="first">
                                Payment result: <strong>{result.status || result.error}</strong>
                            </div>
                        </div>
                    </div>

                    { saved && <div class="result-code">
                        Your card was saved for your future purchases.
                    </div> }

                    <Link to="/user/booking" class="item">
                        <button class="button payment-back">
                            {t("Booking management")}
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
}

export default PaymentResultPage;
