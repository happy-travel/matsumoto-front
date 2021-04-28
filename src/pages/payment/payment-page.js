import React, { useState, useEffect } from "react";
import settings from "settings";
import { loadPaymentServiceData, loadSavedCards } from "tasks/payment/service";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Loader } from "components/simple";
import ReactTooltip from "react-tooltip";
import Breadcrumbs from "components/breadcrumbs";
import PaymentForm from "./parts/payment-form";
import PaymentSavedCardsFormPart from "./parts/saved-cards-form";
import { payByForm } from "tasks/payment/processing";
import { $payment } from "stores";

const PaymentPage = observer(() => {
    const [loading, setLoading] = useState(true);
    const [addNew, setAddNew] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [service, cards] = await Promise.all([
                loadPaymentServiceData(),
                loadSavedCards()
            ]);
            $payment.setService(
                service,
                `${settings.direct_payment_callback_host}/payment/result/${$payment.subject.referenceCode}`
            );
            setLoading(false);
            setAddNew(!cards.length);
        };
        load();
    }, []);

    const { t } = useTranslation();

    if (loading)
        return <Loader />;

    return (
        <div className="payment block">
            <section>
                { $payment.subject.previousPaymentMethod &&
                    <Breadcrumbs
                        backText={t("Back to") + " " + $payment.subject.referenceCode}
                        backLink={`/booking/${$payment.subject.referenceCode}`}
                    />
                }
                { !$payment.subject.previousPaymentMethod &&
                    <Breadcrumbs
                        backText={t("Back to") + " " +  t("Your Booking")}
                        backLink="/accommodation/booking"
                    />
                }

                <div className="accent-frame">
                    <div className="data only">
                        <strong>Please note:</strong>
                        When paying by card, we hold funds on your account until the deadline date approach.
                        In case of cancellation, funds will be released in accordance with the service cancellation policy as soon as possible.
                    </div>
                </div>

                { (addNew || !$payment.savedCards.length) ?
                    <>
                        {!!$payment.savedCards.length &&
                            <div className="return-to-saved-cards">
                                <button onClick={() => setAddNew(false)} className="button">
                                    {t("Back to") + " " + t("Saved Cards")}
                                </button>
                            </div>
                        }
                        <h2>
                            {t("Please Enter Your Card Details")}
                        </h2>
                        <PaymentForm
                            total={$payment.subject.price}
                            pay={payByForm}
                        />
                    </> :
                    <>
                        <h2>
                            {t("Pay using saved cards")}
                        </h2>
                        <PaymentSavedCardsFormPart />
                        <button onClick={() => setAddNew(true)} className="button">
                            {t("Use another card")}
                        </button>
                    </>
                }
            </section>
            <ReactTooltip place="top" type="dark" effect="solid" />
        </div>
    );
});

export default PaymentPage;
