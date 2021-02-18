import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { redirect } from "core";
import paymentStore from "stores/payment-store";
import View, { MODALS } from "stores/view-store";

@observer
class BookingActionPart extends React.Component {
    showCancellationConfirmation = () => {
        const { booking } = this.props;
        View.setModal(
            MODALS.CANCELLATION_CONFIRMATION,
            booking
        );
    };

    payNowByCard = () => {
        const { booking } = this.props;
        paymentStore.setSubject(
            booking.bookingDetails.referenceCode,
            booking.totalPrice,
            booking.paymentMethod
        );
        redirect("/payment/form");
    };

    render() {
        const { t } = useTranslation(),
            { booking } = this.props,
            details = booking.bookingDetails;

        return (
<div class="actions">
    {
        "NotPaid" == booking.paymentStatus &&
        "Cancelled" != details.status &&
        "PendingCancellation" != details.status &&
            <button class="button" onClick={this.payNowByCard}>
                {t("Pay now by Card")}
            </button>
    }
    {
        (
            "Captured" == booking.paymentStatus ||
            "Authorized" == booking.paymentStatus
        ) &&
        "Confirmed" == details.status &&
            <Link to={`/booking/${booking.bookingId}/voucher`} class="button">
                {t("Voucher")}
            </Link>
    }
    {
        "Cancelled" != details.status &&
        "PendingCancellation" != details.status &&
        "InternalProcessing" != details.status &&
        "ManualCorrectionNeeded" != details.status &&
            <Link to={`/booking/${booking.bookingId}/invoice`} class="button">
                {t("Invoice")}
            </Link>
    }
    {
        "Cancelled" != details.status &&
        "PendingCancellation" != details.status &&
            <button
                class={
                    "button" +
                    __class(moment().isBefore(details.checkInDate), "transparent-with-border", "gray")
                }
                onClick={this.showCancellationConfirmation}
            >
                {t("Cancel booking")}
            </button>
    }
</div>
        );
    }
}

export default BookingActionPart;
