import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import PaymentInformation from "./parts/payment-information";
import BookingDetailsView from "./parts/booking-details-view";
import paymentStore from "stores/payment-store";

@observer
class AccommodationConfirmationPage extends React.Component {
render() {
    var { t } = useTranslation();

    return (
<div class="confirmation nova block">
    <section class="double-sections">
        <div class="middle-section">
            <Breadcrumbs
                items={[
                    {
                        text: t("Search Accommodations"),
                        link: "/"
                    }, {
                        text: t("Booking Confirmation")
                    }
                ]}
                noBackButton
            />
            <ActionSteps
                items={[t("Search Accommodations"), t("Guest Details"), t("Booking Confirmation")]}
                current={2}
            />
            <PaymentInformation />
            { !paymentStore.paymentResult.error &&
                <BookingDetailsView referenceCode={paymentStore.subject.referenceCode}/>
            }
        </div>
    </section>
</div>
    );
}
}

export default AccommodationConfirmationPage;
