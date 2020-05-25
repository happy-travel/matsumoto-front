import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API, plural } from "core";
import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader, MealPlan, PassengerName } from "components/simple";
import moment from "moment";
import PaymentInformation from "parts/payment-information";

import store from "stores/accommodation-store";

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
        data = store.booking.result || {};

    if (store.paymentResult?.result)
        var {
            params,
            result,
            params_error
        } = (store.paymentResult || {});

    return (
        <div class="confirmation nova block">
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

                    <h2 class="underline">{t("Accommodation")}</h2>
                    <div class="part">
                        <div class="icon-holder">
                            <span class="icon icon-confirmation-price" />
                        </div>
                        <div>
                            <Dual
                                a={t("Booked Service")}
                                b={booking.accommodationName}
                            />
                            <Dual
                                a={t("Address")}
                                b={ booking.location.address }
                            />
                            { !!booking.сontactInfo?.phone && <Dual
                                a={t("Contact")}
                                b={ booking.contactInfo.phone }
                            /> }
                            <Dual
                                  a={t("Service Location")}
                                  b={ booking.location.country + ", " + booking.location.locality }
                            />
                            { !!booking.agentReference && <Dual
                                a={t("Agent Reference")}
                                b={booking.agentReference}
                            /> }
                        </div>
                    </div>

                    <h2 class="underline">{t("Booking Details")}</h2>
                    <div class="part">
                        <div class="icon-holder">
                            <span class="icon icon-confirmation-dates"/>
                        </div>
                        <div class="line">
                            <Dual
                                  a={t("Your Booking")}
                                  b={
                                      plural(t, booking.numberOfNights, "Night") + ", " +
                                      plural(t, booking.roomDetails.length, "Room")
                                  }
                            />
                            <Dual
                                a={"Check In Date"}
                                b={dateFormat.a(booking.checkInDate)}
                            />
                            <Dual
                                a={"Check Out Date"}
                                b={dateFormat.a(booking.checkOutDate)}
                            />
                        </div>
                    </div>
                    <div class="part">
                        <div class="icon-holder">
                            <span class="icon icon-confirmation-hotel"/>
                        </div>
                        <div class="line">
                            <Dual
                                a={t("Total Cost")}
                                b={<b class="green">{price(data.totalPrice)}</b>}
                            />
                        </div>
                    </div>

                    <h2 class="underline">{t("Room Details")}</h2>
                    { booking.roomDetails.map((room, index) => (
                        <React.Fragment>
                            <div class="part">
                                <div class="icon-holder circle">
                                    { booking.roomDetails.length > 1 ?
                                        index+1 :
                                        <span class="icon icon-confirmation-passenger"/> }
                                </div>
                                <div class="line">
                                    <Dual
                                        a={t("Room type")}
                                        b={room.contractDescription}
                                    />
                                    <Dual
                                        a={t("Board basis")}
                                        b={<MealPlan t={t} room={room} />}
                                    />
                                    <Dual
                                        a={t("Room Cost")}
                                        b={<b class="green">{price(room.price)}</b>}
                                    />
                                </div>
                            </div>
                            <div class="part no-icon">
                                <Dual
                                    a={t("Accommodates")}
                                    b={[...Array(room.passengers.length).fill(<span class="icon icon-man"/>)]}
                                />
                                <Dual addClass={room.passengers.length < 2 && "grow"}
                                    a={t("Leading Passenger")}
                                    b={<PassengerName passenger={room.passengers[0]} />}
                                />
                                { (room.passengers.length > 1) &&
                                    <Dual
                                        a={t("Other Passengers")}
                                        b={room.passengers.map( (item, index) => ( !!index &&
                                            <div><PassengerName passenger={ item } /></div>
                                        ))}
                                    />}
                            </div>
                            {!!room?.remarks?.length && <div class="part no-icon remarks">
                                { room.remarks.map(item => (
                                    <div>
                                        <b>{item.key}:</b> {item.value}
                                    </div>
                                ))}
                            </div> }
                        </React.Fragment>
                    ))}

                    <div class="actions">
                        <button class="button" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.VOUCHER)}>
                            {t("Send Voucher")}
                        </button>
                        <button class="button" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.INVOICE)}>
                            {t("Send Invoice")}
                        </button>

                        { this.state.fromHistory &&
                          "Cancelled" != booking.status &&
                        <button class={"button" + ( moment().isBefore(booking.checkInDate) ? " pink" : " gray")} onClick={this.showCancellationConfirmation}>
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
