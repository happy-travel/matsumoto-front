import { redirect } from "core";
import paymentStore from "stores/payment-store";

export const directPaymentCallback = (data, error) => {
    if ("Secure3d" == data?.status) {
        window.location.href = data.secure3d;
        return;
    }

    paymentStore.setPaymentResult(data?.status, error);
    redirect("/pay/confirmation");
};
