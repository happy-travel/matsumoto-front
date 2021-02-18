import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import ViewFailed from "parts/view-failed";
import paymentStore from "stores/payment-store";
import { PAYMENT_METHODS } from "enum";

@observer
class PaymentInformation extends React.Component {
    render() {
        if (paymentStore.paymentMethod != PAYMENT_METHODS.CARD)
            return null;

        var { t } = useTranslation();

        const {
            error,
            status,
        } = paymentStore.paymentResult;

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
                        paymentStore.paymentMethod == PAYMENT_METHODS.CARD ?
                            "/payment/form" :
                            "/accommodation/booking"
                    }
                />
            );

        if (status)
            return (
                <div className="accent-frame">
                    <div className="before">
                        <span className="icon icon-white-check" />
                    </div>
                    <div className="dual">
                        <div className="first">
                            {t("Payment result")}: <strong>{status || "Unknown"}</strong>
                        </div>
                        { paymentStore.saveCreditCard &&
                            <div className="second">
                                <div>
                                    {t("Your card was saved for your future purchases.")}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );

        return null;
    }
}

export default PaymentInformation;
