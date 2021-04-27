import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import PaymentInformation from "./parts/payment-information";
import BookingConfirmationView from "./parts/booking-confirmation-view";
import { $payment } from "stores";

const AccommodationConfirmationPage = observer(() => {
    const { t } = useTranslation();
    return (
        <div className="booking block">
            <section>
                { !$payment.paymentResult.error &&
                    <Breadcrumbs
                        backLink="/bookings"
                        backText={t("Back to") + " " + t("Bookings List")}
                    />
                }
                { $payment.paymentResult.error &&
                    <PaymentInformation />
                }
                { !$payment.paymentResult.error &&
                    <BookingConfirmationView
                        referenceCode={$payment.subject.referenceCode}
                        PaymentInformation={<PaymentInformation />}
                    />
                }
            </section>
        </div>
    );
});

export default AccommodationConfirmationPage;
