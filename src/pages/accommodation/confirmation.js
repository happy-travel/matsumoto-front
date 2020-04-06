import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API, plural } from "core";
import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader } from "components/simple";
import { Link } from "react-router-dom";
import moment from "moment";

import store from "stores/accommodation-store";

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
                after: (result, err, data) => store.setBookingResult(result, data)
            });
        }
    }

render() {
    var { t } = useTranslation(),
        booking = store.booking.result?.bookingDetails || {},
        accommodation = store.booking.result?.serviceDetails || {};

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

                        { ("YES" == params.remember_me && !result.error) && <div>
                            {t("Your card was saved for your future purchases.")}
                        </div> }
                    </React.Fragment> }

                    { !booking.referenceCode
                        ? ( result?.error ? null : <Loader /> )
                        : <React.Fragment>
                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class={"result-code" + ( "Cancelled" == booking.status ? " cancelled" : "")}>
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
                        b={accommodation.accommodationName}
                    />

                    { /* todo: no data */}
                    <Dual addClass="line"
                        a={t("Additional")}
                        b={accommodation.roomContractSet?.roomContract?.[0]?.contractType}
                    />

                    <Dual addClass="line"
                        a={t("Total Cost")}
                        b={price(accommodation.roomContractSet.price)}
                    />

                    <Dual addClass="line"
                        a={t("Service Location")}
                        b={accommodation.countryName + ", " + accommodation.cityName}
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

                    { /* todo: no data */}
                    <Dual addClass="line"
                        a={t("Board basis")}
                        b={accommodation.roomContractSet?.roomContract?.[0] ? <React.Fragment>
                            {accommodation.roomContractSet.roomContract[0].boardBasisCode}:{" "}
                            {accommodation.roomContractSet.roomContract[0].boardBasisCode == "RO" ? t("Room Only"
                            ) : (accommodation.roomContractSet.roomContract[0].mealPlan || "")}
                        </React.Fragment> : null}
                    />

                    { !!booking.roomDetails.length && <h2>
                        {t("Leading Passenger")}
                    </h2> }
                    <Passenger passenger={booking.roomDetails?.[0]?.roomDetails?.passengers[0]} />

                    { (booking.roomDetails.length > 1 || booking.roomDetails?.[0]?.roomDetails.passengers.length > 1) && <React.Fragment>
                        <h2>
                            {t("Other Passengers")}
                        </h2>

                        { booking.roomDetails.map((room, index1) => (
                            room.roomDetails.passengers.map(( item, index2 ) => (
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
                                b={room.roomDetails.type}
                            />
                            <Dual addClass="line"
                                a={t("Room Cost")}
                                b={
                                    null
                                    /* price(accommodation.roomContractSet.roomContracts[index].roomPrices[0]) */
                                }
                            />
                            <Dual addClass="line"
                                a={t("Accommodates")}
                                b={ ""
                                   /* plural(t, accommodation.roomContractSet.roomContracts[index].adultsNumber, "Adult")
                                    + (!accommodation.roomContractSet.roomContracts[index].childrenNumber ? "" :
                                    (", " + plural(t, accommodation.roomContractSet.rooms[index].childrenNumber, "Children"))) */
                                }
                            />

                            { room.roomDetails.length > 1 && <React.Fragment>
                                {room.roomDetails.passengers.map((item) => (
                                    <Passenger passenger={ item } />
                                ))}
                            </React.Fragment> }

                        </React.Fragment>
                    ))}

                    { /* todo: no data */}
                    { !!Object.keys(accommodation?.roomContractSet?.remarks || {}).length &&
                        <React.Fragment>
                            <h2 style={{ marginBottom: "17px" }}>
                                {t("Remark")}
                            </h2>
                            {Object.keys(accommodation.roomContractSet.remarks).map(key => (
                                <p class="remark">{accommodation.roomContractSet.remarks[key]}</p>
                            ))}
                        </React.Fragment>
                     }

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
                        <button class={"button" + ( moment().isBefore(booking.checkInDate) ? " pink" : " gray")} onClick={this.showCancellationConfirmation}>
                            {t("Cancel booking")}
                        </button> }

                        { /* <Link to="/user/booking">
                            <button class="button green">
                                {t("Booking management")}
                            </button>
                        </Link> */ }
                    </div>
                    </React.Fragment> }

                </div>
            </section>
        </div>
    );
}
}

export default AccommodationConfirmationPage;
