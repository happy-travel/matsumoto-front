import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";

import {
    Dual, Loader, MealPlan, dateFormat, price
} from "simple";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";

import PaymentInformation from "parts/payment-information";

import store from "stores/accommodation-store";
import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

const Passenger = ({ passenger }) => (
    passenger ? <Dual addClass="line"
        a={"Passenger Name"}
        b={passenger.title + ". " + passenger.firstName + " " + passenger.lastName}
    /> : null
);

@observer
class AccommodationConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromGetter: false
        };
        this.showCancellationConfirmation = this.showCancellationConfirmation.bind(this);
    }

    showCancellationConfirmation() {
        UI.setModalData({
            bookingId: store.booking.result.bookingId,
            ...store.booking.result.bookingDetails
        });
        UI.setModal(MODALS.CANCELLATION_CONFIRMATION);
    }

    showSendInvoiceModal(type) {
        UI.setModalData({
            type,
            bookingId: store.booking.result.bookingId,
            ...store.booking.result.bookingDetails
        });
        UI.setModal(MODALS.SEND_INVOICE);
    }

    componentDidMount() {
        store.setBookingResult(null);

        var bookingId = this.props?.match?.params?.id,
            referenceCode = null,
            fromHistory = true,
            tryOfRef = store.paymentResult?.params?.settlement_reference || store.paymentResult?.params?.referenceCode;

        if (bookingId === undefined && tryOfRef) {
            referenceCode = tryOfRef;
            fromHistory = false;
        }

        if ( bookingId || referenceCode ) {
            this.setState({
                fromGetter: true,
                fromHistory
            });
            API.get({
                url: referenceCode ? API.BOOKING_GET_BY_CODE(referenceCode) : API.BOOKING_GET_BY_ID(bookingId),
                after: (result, err, data) => store.setBookingResult(result || {}, data, err)
            });
        }
    }

render() {
    var { t } = useTranslation(),
        booking = store.booking.result?.bookingDetails || {},
        data = store.booking.result || {};

    if (store.paymentResult?.result)
        var {
            params,
            result,
            params_error
        } = (store.paymentResult || {});

    return (
        <div class="confirmation block editor">
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
                    { !this.state.fromHistory && <ActionSteps
                        items={[t("Search accommodation"), t("Guest Details"), t("Booking Confirmation")]}
                        current={2}
                    /> }

                    { (!this.state.fromHistory && result) && <PaymentInformation
                        params_error={params_error}
                        params={params}
                        result={result}
                    /> }

                    { !booking.referenceCode
                        ? ( result?.error ? null : <Loader /> )
                        : <React.Fragment>
                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class={"accent-frame" + __class("Cancelled" == booking.status, "cancelled")}>
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

                    <Dual addClass="line"
                        a={t("Booked Service")}
                        b={booking.accommodationName}
                    />

                    <Dual addClass="line"
                        a={t("Total Cost")}
                        b={price(data.totalPrice)}
                    />

                    <Dual addClass="line"
                        a={t("Service Location")}
                        b={ <React.Fragment>
                                {booking.location.country + ", " + booking.location.locality}<br/>
                                {booking.location.address}
                            </React.Fragment> }
                    />

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

                    { !!booking.roomDetails.length && <h2>
                        {t("Leading Passenger")}
                    </h2> }
                    <Passenger passenger={booking.roomDetails?.[0]?.passengers[0]} />

                    { (booking.roomDetails.length > 1 || booking.roomDetails?.[0]?.passengers.length > 1) && <React.Fragment>
                        <h2>
                            {t("Other Passengers")}
                        </h2>

                        { booking.roomDetails.map((room, index1) => (
                            room.passengers.map(( item, index2 ) => (
                                (index1 || index2) ? <Passenger passenger={ item } /> : null
                            ))
                        ))}

                    </React.Fragment> }

                    { booking.roomDetails.map((room, index) => (
                        <React.Fragment>
                            <h2>
                                {t("Room")} {booking.roomDetails.length > 1 && (" " + (index+1))}
                            </h2>

                            <Dual addClass="line"
                                a={t("Room type")}
                                b={room.contractDescription}
                            />
                            <Dual addClass="line"
                                  a={t("Board basis")}
                                  b={<MealPlan t={t} room={room} />}
                            />
                            <Dual addClass="line"
                                a={t("Room Cost")}
                                b={price(room.price)}
                            />
                            <Dual addClass="line"
                                a={t("Accommodates")}
                                b={[...Array(room.passengers.length).fill(<span className="icon icon-man"/>)]}
                            />

                            { room.length > 1 && <React.Fragment>
                                {room.passengers.map((item) => (
                                    <Passenger passenger={ item } />
                                ))}
                            </React.Fragment> }

                            { room?.remarks?.map(item => (
                                <Dual addClass="line"
                                      a={item.key}
                                      b={item.value}
                                />
                            ))}

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

                        <div class="left">
                            <button class="button small" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.VOUCHER)}>
                                {t("Send Voucher")}
                            </button>
                            <button class="button small" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.INVOICE)}>
                                {t("Send Invoice")}
                            </button>
                        </div>

                        { this.state.fromHistory &&
                          "Cancelled" != booking.status &&
                        <button
                            class={"button" + __class(moment().isBefore(booking.checkInDate), "pink", "gray")}
                            onClick={this.showCancellationConfirmation}>
                            {t("Cancel booking")}
                        </button> }
                    </div>
                    </React.Fragment> }

                </div>
            </section>
        </div>
    );
}
}

export default AccommodationConfirmationPage;
