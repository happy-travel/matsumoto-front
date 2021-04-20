import React from "react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import BookingConfirmationView from "./parts/booking-confirmation-view";

const AccommodationViewBookingPage = ({ match }) => {
    const { t } = useTranslation();

    return (
        <div className="booking block">
            <section>
                <Breadcrumbs
                    backLink="/bookings"
                    backText={t("Back to") + " " + t("Bookings List")}
                />
                <BookingConfirmationView referenceCode={match.params.code} />
            </section>
        </div>
    );
};

export default AccommodationViewBookingPage;
