import { API } from "core";
import { FORM_NAMES } from "components/form";
import { redirect } from "core";
import { PAYMENT_METHODS } from "enum";
import { $payment, $ui } from "stores";

export const paymentCallback = (data, error) => {
    if ("Secure3d" == data?.status) {
        window.location.href = data.secure3d;
        return;
    }

    $payment.setPaymentResult(data?.status, error);

    if (error) {
        redirect("/accommodation/confirmation");
        return;
    }

    API.post({
        url: ($payment.subject.previousPaymentMethod == PAYMENT_METHODS.ACCOUNT) ?
            API.BOOKING_PAY_WITH_CARD($payment.subject.referenceCode) :
            API.A_BOOKING_FINALIZE($payment.subject.referenceCode),
        after: () => {
            $ui.dropFormCache(FORM_NAMES.BookingForm);
            redirect("/accommodation/confirmation");
        }
    });
};
