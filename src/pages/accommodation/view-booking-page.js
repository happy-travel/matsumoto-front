import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import BookingConfirmationView from "./parts/booking-confirmation-view";

@observer
class AccommodationViewBookingPage extends React.Component {
    render() {
        var { t } = useTranslation();

        return (
<div className="confirmation nova block">
    <section className="double-sections">
        <div className="middle-section">
            <Breadcrumbs
                items={[
                    {
                        text: t("Bookings"),
                        link: "/bookings"
                    }, {
                        text: t("Booking Confirmation")
                    }
                ]}
                backLink="/bookings"
            />
            <BookingConfirmationView referenceCode={this.props.match.params.code} />
        </div>
    </section>
</div>
        );
    }
}

export default AccommodationViewBookingPage;
