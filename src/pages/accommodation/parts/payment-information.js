import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import ViewFailed from "parts/view-failed";
import { PAYMENT_METHODS } from "enum";
import { $payment } from "stores";

const PaymentInformation = observer(() => {
    const { t } = useTranslation();

    if ($payment.paymentMethod != PAYMENT_METHODS.CARD)
        return null;

    const { error, status } = $payment.paymentResult;

    if (error)
        return (
            <ViewFailed
                reason={
                    <>
                        {t("Payment failed")}<br/>
                        {error}<br/>
                        <br/>
                        {t("Your payment did not go through")}
                    </>
                }
                button={t("Try to pay again")}
                link={
                    $payment.paymentMethod == PAYMENT_METHODS.CARD ?
                        "/payment/form" :
                        "/accommodation/booking"
                }
            />
        );

    if (status)
        return (
            <div className="accent-frame">
                <div className="before">
                    <span className="icon icon-success" />
                </div>
                <div className="data">
                    <div className="first">
                        {t("Payment Result")}<br />
                        <span className={"status " + status}>{status || "Unknown"}</span>
                        { $payment.saveCreditCard &&
                            <div>
                                {t("Your card was saved for your future purchases")}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );

    return null;
});

export default PaymentInformation;
