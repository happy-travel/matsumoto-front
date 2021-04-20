import { redirect } from "core";
import { $payment } from "stores";

export const directPaymentCallback = (data, error) => {
    if ("Secure3d" == data?.status) {
        window.location.href = data.secure3d;
        return;
    }

    $payment.setPaymentResult(
        data?.status, error ||
        (data?.status == "Failed" && data?.message)
    );
    redirect("/pay/confirmation");
};
