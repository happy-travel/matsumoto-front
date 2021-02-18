import { API } from "core";
import { FORM_NAMES } from "../../components/form";
import { redirect } from "core";
import { PAYMENT_METHODS } from "enum";
import paymentStore from "stores/payment-store";
import UI from "stores/ui-store";

export const paymentCallback = (data, error) => {
    if ("Secure3d" == data?.status) {
        window.location.href = data.secure3d;
        return;
    }

    paymentStore.setPaymentResult(data?.status, error);

    if (error) {
        redirect("/accommodation/confirmation");
        return;
    }

    API.post({
        url: (paymentStore.subject.previousPaymentMethod == PAYMENT_METHODS.ACCOUNT) ?
            API.BOOKING_PAY_WITH_CARD(paymentStore.subject.referenceCode) :
            API.A_BOOKING_FINALIZE(paymentStore.subject.referenceCode),
        after: () => {
            UI.dropFormCache(FORM_NAMES.BookingForm);
            redirect("/accommodation/confirmation");
        }
    });
};
