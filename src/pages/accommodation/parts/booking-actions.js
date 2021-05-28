import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { redirect } from "core";
import { date } from "simple";
import { MODALS } from "enum/modals-enum";
import { $payment, $view } from "stores";

const BookingActionPart = observer(({ booking }) => {
    const showCancellationConfirmation = () => {
        $view.setModal(
            MODALS.CANCELLATION_CONFIRMATION,
            booking
        );
    };

    const payNowByCard = () => {
        $payment.setSubject(
            booking.bookingDetails.referenceCode,
            booking.totalPrice,
            booking.paymentMethod
        );
        redirect("/payment/form");
    };

    const { t } = useTranslation();
    const details = booking.bookingDetails;

    return (
        <div className="actions">
            {
                "NotPaid" == booking.paymentStatus &&
                "Cancelled" != details.status &&
                "PendingCancellation" != details.status &&
                    <button className="button" onClick={payNowByCard}>
                        {t("Pay now by Card")}
                    </button>
            }
            {
                (
                    "Captured" == booking.paymentStatus ||
                    "Authorized" == booking.paymentStatus
                ) &&
                "Confirmed" == details.status &&
                    <Link to={`/booking/${booking.bookingId}/voucher`} className="button">
                        {t("Voucher")}
                    </Link>
            }
            {
                "Cancelled" != details.status &&
                "PendingCancellation" != details.status &&
                "InternalProcessing" != details.status &&
                "ManualCorrectionNeeded" != details.status &&
                    <Link to={`/booking/${booking.bookingId}/invoice`} className="button">
                        {t("Invoice")}
                    </Link>
            }
            {
                "Cancelled" != details.status &&
                "PendingCancellation" != details.status &&
                    <button
                        className={
                            "button" +
                            __class(date.isPast(details.checkInDate), "gray")
                        }
                        onClick={showCancellationConfirmation}
                    >
                        {t("Cancel booking")}
                    </button>
            }
        </div>
    );
});

export default BookingActionPart;
