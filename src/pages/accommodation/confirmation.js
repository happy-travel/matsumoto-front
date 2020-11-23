import React from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";

import {
    Dual, Loader, MealPlan, PassengerName, GroupRoomTypesAndCount, dateFormat, price
} from "simple";

import { remapStatus } from "../user/booking-management/table-data";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import FullDeadline from "components/full-deadline";

import PaymentInformation from "parts/payment-information";
import ViewFailed from "parts/view-failed";

import store from "stores/accommodation-store";
import authStore from "stores/auth-store";
import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

@observer
class AccommodationConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromGetter: false,
            statusLoading: false,
            redirect: null
        };
        this.showCancellationConfirmation = this.showCancellationConfirmation.bind(this);
        this.payNowByCard = this.payNowByCard.bind(this);
        this.loadBooking = this.loadBooking.bind(this);
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

    updateBookingStatus() {
        this.setState({ statusLoading: true });
        API.post({
            url: API.BOOKING_STATUS(store.booking.result.bookingId),
            success: (data = {}) => store.setUpdatedBookingStatus(data.status),
            after: () => {
                this.setState({ statusLoading: false });
                this.loadBooking();
            }
        });
    }

    payNowByCard() {
        store.setBookingReferenceCode(store.booking.result?.bookingDetails?.referenceCode);
        store.setBookingToPay(store.booking.result);
        this.setState({ redirect: "/payment/form" });
    }

    loadBooking() {
        store.setBookingResult(null);

        var bookingId = this.props?.match?.params?.id,
            referenceCode = null,
            fromHistory = true,
            tryOfRef = store.paymentResult?.params?.settlement_reference || store.paymentResult?.params?.referenceCode;

        if (bookingId === undefined && tryOfRef) {
            referenceCode = tryOfRef;
            fromHistory = false;
        }

        if (fromHistory)
            store.setPaymentResult(null);

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

    componentDidMount() {
        this.loadBooking();
    }

render() {
    var { t } = useTranslation(),
        booking = store.booking.result?.bookingDetails || {},
        data = store.booking.result || {};

    if (this.state.redirect)
        return <Redirect push to={this.state.redirect}/>;

    if (store.paymentResult?.result)
        var {
            params,
            result,
            params_error
        } = (store.paymentResult || {});

    return (
        <div class="confirmation nova block">
            <section class="double-sections">
                <div class="middle-section">
                    <Breadcrumbs items={[
                        {
                            text: t("Search Accommodations"),
                            link: "/search"
                        }, {
                            text: t("Booking Confirmation")
                        }
                    ]}
                        backLink={
                            authStore.activeCounterparty?.inAgencyPermissions?.includes("AgencyBookingsManagement") ?
                                "/agency/bookings" :
                                "/agent/bookings"
                        }
                        noBackButton={!this.state.fromHistory}
                    />
                    { !this.state.fromHistory && <ActionSteps
                        items={[t("Search Accommodations"), t("Guest Details"), t("Booking Confirmation")]}
                        current={2}
                    /> }

                    { (!this.state.fromHistory && result) && <PaymentInformation
                        params_error={params_error}
                        params={params}
                        result={result}
                    /> }
                    { (!booking.referenceCode || result?.error)
                        ? ( (data?.error || result?.error) ?
                            ((this.state.fromHistory || !result?.error) ? <ViewFailed
                                reason={t("Unable to load a booking confirmation")}
                                button={t("Back to booking management")}
                                link="/agent/bookings"
                            /> : null)
                        : <Loader /> )
                        : <React.Fragment>

                    <div class={"accent-frame" + __class("Cancelled" == booking.status, "cancelled")}>
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong class="green">{booking.referenceCode}</strong>
                            </div>
                            {!this.state.statusLoading ?
                                <div class="second">
                                    {t("Status")}: <strong class={booking.status}>{remapStatus(booking.status)}</strong>
                                    <div class="status-updater">
                                        <button class="small button transparent-with-border" onClick={() => this.updateBookingStatus()}>
                                            ⟳
                                        </button>
                                    </div>
                                </div> :
                                <div class="second">
                                    Updating...
                                </div>
                            }
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
                            { !!data.supplier &&
                            <Dual addClass="grow"
                                  a={"Supplier"}
                                  b={data.supplier}
                            />
                            }
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
                                      __plural(t, booking.numberOfNights, "Night") + ", " +
                                      __plural(t, booking.roomDetails.length, "Room")
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
                            { data.paymentStatus && <Dual addClass="grow"
                                a={t("Payment Status")}
                                b={data.paymentStatus.replace(/([A-Z])/g, " $1")}
                            /> }
                        </div>
                    </div>

                    <h2 class="underline">{t("Room Details")}</h2>
                    { booking.roomDetails.map((room, index) => (
                        <div class="room-part">
                            <div class="part">
                                <div class="icon-holder">
                                    <div class="icon icon-confirmation-circle">
                                        { booking.roomDetails.length > 1 ?
                                            index+1 :
                                            <span class="icon icon-confirmation-passenger"/> }
                                    </div>
                                </div>
                                <div class="line">
                                    <Dual
                                        a={t("Room type")}
                                        b={<GroupRoomTypesAndCount solo t={t} contracts={[room]} />}
                                    />
                                    <Dual
                                        a={t("Board basis")}
                                        b={<MealPlan t={t} room={room} />}
                                    />
                                    <Dual
                                        a={t("Room Cost")}
                                        b={<b class="green">{price(room.rate)}</b>}
                                    />
                                </div>
                            </div>
                            <div class="part no-icon">
                                <Dual
                                    a={t("Accommodates")}
                                    b={[...Array(room.passengers.length).fill(<span class="icon icon-man"/>)]}
                                />
                                <Dual addClass={__class(room.passengers.length < 2, "grow")}
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
                            { room.supplierRoomReferenceCode && <div class="part no-icon">
                                <Dual
                                    a={t("Supplier Reference Code")}
                                    b={room.supplierRoomReferenceCode}
                                />
                            </div> }
                            <FullDeadline t={t}
                                          deadline={room.deadlineDetails}
                                          remarks={room?.remarks}
                            />
                        </div>
                    ))}

                    <div class="actions">
                        { "NotPaid" == data.paymentStatus &&
                          "Cancelled" != booking.status &&
                            <button class="button" onClick={this.payNowByCard}>
                                {t("Pay now by Card")}
                            </button>
                        }
                        <button class="button" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.VOUCHER)}>
                            {t("Send Voucher")}
                        </button>
                        <button class="button" onClick={() => this.showSendInvoiceModal(INVOICE_TYPES.INVOICE)}>
                            {t("Send Invoice")}
                        </button>

                        { this.state.fromHistory &&
                          "Cancelled" != booking.status &&
                        <button
                            class={
                                "button" +
                                __class(moment().isBefore(booking.checkInDate), "transparent-with-border", "gray")
                            }
                            onClick={this.showCancellationConfirmation}
                        >
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
