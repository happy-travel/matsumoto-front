import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API } from "core";
import UI, { MODALS } from "stores/ui-store";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader } from "components/simple";
import { Link } from "react-router-dom";
import moment from "moment";

import store from "stores/accommodation-store";

@observer
class AccommodationConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromGetter: false
        };
        this.getValues = this.getValues.bind(this);
        this.showCancellationConfirmation = this.showCancellationConfirmation.bind(this);
    }

    getValues() {
        var result = store.booking.result;

        if (this.state.fromGetter) {
            var selected = store.booking.selected;
            if (selected) {
                result = selected.bookingDetails || {};
                result.loaded = true;
            }
        }

        var rooms = [];
        for (var i = 0; i < result.roomDetails?.length; i++) {
            rooms.push({
                roomType: result.roomDetails[i]?.roomDetails.type,
                currency: store.selected?.variant?.currencyCode || "", //todo: wait for real data
                price: result.roomDetails[i]?.price.price,
                passengers: result.roomDetails[i]?.roomDetails.passengers,
            })
        }

        return {
            referenceCode: result.referenceCode,
            status: result.status,
            checkInDate: result.checkInDate,
            checkOutDate: result.checkOutDate,
            deadline: result.deadline,
            loaded: result.loaded,
            error: result.error,
            id: result.bookingId,
            rooms
        };
    }

    showCancellationConfirmation() {
        var booking = this.getValues();
        UI.setModalData({
            bookingId: booking.id,
            deadline: booking.deadline,
            referenceCode: booking.referenceCode
        });
        UI.setModal(MODALS.CANCELLATION_CONFIRMATION);
    }

    componentDidMount() {
        var bookingId = this.props?.match?.params?.id,
            referenceCode = null,
            fromHistory = true;

        if (bookingId === undefined && store.paymentResult?.params?.settlement_reference) {
            referenceCode = store.paymentResult?.params?.settlement_reference;
            fromHistory = false;
        }

        if ( bookingId || referenceCode) {
            this.setState({
                fromGetter: true,
                fromHistory
            });
            API.get({
                url: referenceCode ? API.BOOKING_GET_BY_CODE(referenceCode) : API.BOOKING_GET_BY_ID(bookingId),
                after: data => store.setSelectedBooking(data)
            });
        }
    }

render() {
    const { t } = useTranslation(),
          booking = this.getValues();

    if (store.paymentResult?.result)
        var {
            params,
            result,
            params_error
        } = (store.paymentResult || {});

    return (
        <div class="confirmation block">
            <div class="hide">{''+store.booking}</div>
            <section class="double-sections">
                <div class="middle-section">
                    <Breadcrumbs items={[
                        {
                            text: t("Search accommodation"),
                            link: "/search"
                        }, {
                            text: t("Booking Confirmation")
                        }
                    ]}/>
                    <ActionSteps
                        items={[t("Search accommodation"), t("Guest Details"), t("Booking Confirmation")]}
                        current={2}
                    />

                    { (!this.state.fromHistory && result) &&
                    <React.Fragment>
                        { params_error && <div class={"result-code error"}>
                            <div class="before">
                                <span class="icon icon-close white" />
                            </div>
                            <div class="dual">
                                <div class="first">
                                    {t("Card acceptance message")}: <strong>{params?.response_message}</strong>
                                </div>
                                <div class="second">
                                    {t("Response code")}: <strong>{params?.response_code}</strong>
                                </div>
                            </div>
                        </div> }

                        <div class={"result-code" + (result.error ? " error" : "")}>
                            { (result.status || result.error) && <div class="before">
                                { result.error ? <span class="icon icon-close white" /> : <span class="icon icon-white-check" /> }
                            </div> }
                            <div class="dual">
                                <div class="first">
                                    {t("Payment result")}: <strong>{result.status || result.error}</strong>
                                </div>
                            </div>
                        </div>

                        { ("YES" == params.remember_me) && <div class="result-code">
                            {t("Your card was saved for your future purchases.")}
                        </div> }
                    </React.Fragment> }

                    { booking.referenceCode && <React.Fragment>
                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong class="green">{booking.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t("Status")}: <strong class={booking.status}>{booking.status}</strong>
                            </div>
                        </div>
                    </div>

                    <Dual
                        a={<Dual addClass="line"
                                a={"Check In Date"}
                                b={dateFormat.a(booking.checkInDate)}
                            />}
                        b={<Dual addClass="line"
                                a={"Check Out Date"}
                                b={dateFormat.a(booking.checkOutDate)}
                            />}
                    />
                    <Dual addClass="line"
                        a={"Within deadline"}
                        b={dateFormat.a(booking.deadline)}
                    />

                    { booking.rooms.map((room, index) => (
                        <React.Fragment>
                            {booking.rooms.length > 1 &&
                            <h2>
                                {t('Room') + " " + (index+1)}
                            </h2>}

                            <Dual addClass="line"
                                  a={t('Room type')}
                                  b={room.roomType}
                            />
                            <Dual addClass="line"
                                a={t('Total Cost')}
                                b={price(room.currency, room.price)}
                            />

                            <h2>
                                {t("Leading Passenger")}
                            </h2>  { /* todo: initials fix */ }
                            <Dual
                                a={<Dual addClass="line"
                                        a={"First name"}
                                        b={room.passengers[0].firstName || room.passengers[0].initials}
                                    />}
                                b={<Dual addClass="line"
                                        a={"Last name"}
                                        b={room.passengers[0].lastName}
                                    />}
                            />

                            { room.passengers?.length > 1 && <React.Fragment>
                                <h2>
                                    {t("Other Passengers")}
                                </h2>
                                {room.passengers.map((item,index) => (
                                    <React.Fragment>
                                        {index ? <Dual
                                            a={<Dual addClass="line"
                                                    a={"First name"}
                                                    b={item.firstName || item.initials}
                                                />}
                                            b={<Dual addClass="line"
                                                    a={"Last name"}
                                                    b={item.lastName}
                                                />}
                                        /> : null}
                                    </React.Fragment>
                                ))}
                            </React.Fragment> }

                        </React.Fragment>
                    ))}

                    <div class="actions">
                        { /* <a href="javascript:void(0)">
                            <span class="icon icon-action-time-left" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-pen" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-print" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-writing" />
                        </a> */ }

                        { this.state.fromHistory &&
                          moment().isBefore(booking.checkInDate) &&
                          "Cancelled" != booking.status &&
                        <button class="button pink" onClick={this.showCancellationConfirmation}>
                            {t("Cancel booking")}
                        </button> }

                        <Link to="/user/booking">
                            <button class="button green">
                                {t("Booking management")}
                            </button>
                        </Link>
                    </div>
                    </React.Fragment> }

                </div>
            </section>
        </div>
    );
}
}

export default AccommodationConfirmationPage;
