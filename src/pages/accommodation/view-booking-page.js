import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import BookingDetailsView from "./parts/booking-details-view";

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
            <BookingDetailsView referenceCode={this.props.match.params.code} />
        </div>
    </section>
</div>
        );
    }
}

export default AccommodationViewBookingPage;
