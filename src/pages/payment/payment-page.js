import React from "react";
import settings from "settings";
import { loadPaymentServiceData, loadSavedCards } from "tasks/payment/service";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Loader } from "simple";
import ReactTooltip from "react-tooltip";
import Breadcrumbs from "components/breadcrumbs";
import PaymentForm from "./parts/payment-form";
import PaymentSavedCardsFormPart from "./parts/saved-cards-form";
import { payByForm } from "tasks/payment/processing";
import paymentStore from "stores/payment-store";

@observer
class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            addNew: false
        };
    }

    async componentDidMount() {
        const [service, cards] = await Promise.all([
            loadPaymentServiceData(),
            loadSavedCards()
        ]);
        paymentStore.setService(
            service,
            `${settings.direct_payment_callback_host}/payment/result/${paymentStore.subject.referenceCode}`
        );
        this.setState({
            loading: false,
            addNew: !cards.length
        });
    }

    render() {
        const { t } = useTranslation();

        if (this.state.loading)
            return <Loader />;

        return (
<div class="confirmation block payment">
    <section class="double-sections">
        <div class="middle-section">
            { paymentStore.subject.previousPaymentMethod &&
                <Breadcrumbs
                    items={[
                        { text: t("Bookings"), link: "/bookings" },
                        { text: paymentStore.subject.referenceCode, link: `/booking/${paymentStore.subject.referenceCode}` },
                        { text: t("Payment") }
                    ]}
                    backLink={`/booking/${paymentStore.subject.referenceCode}`}
                />
            }
            { !paymentStore.subject.previousPaymentMethod &&
                <Breadcrumbs
                    items={[
                        { text: t("Search Accommodations"), link: "/search" },
                        { text: t("Your Booking"), link: "/accommodation/booking" },
                        { text: t("Payment") }
                    ]}
                    backLink="/accommodation/booking"
                />
            }

            <p class="remark">
                <strong>Please note:</strong> when paying by card, we hold funds on your account until the deadline date approach.
                In case of cancellation, funds will be released in accordance with the service cancellation policy as soon as possible.
            </p>

            { this.state.addNew ?
                <>
                    {!!paymentStore.savedCards.length &&
                        <div class="form" style={{ paddingTop: "40px" }}>
                            <button onClick={() => this.setState({ addNew: false })} class="button transparent-with-border">
                                {t("Back to saved cards")}
                            </button>
                        </div>
                    }
                    <h2 class="payment-title">
                        {t("Please Enter Your Card Details")}
                    </h2>
                    <PaymentForm
                        total={paymentStore.subject.price}
                        pay={payByForm}
                    />
                </> :
                <>
                    <h2 class="payment-title">
                        {t("Pay using saved cards")}
                    </h2>
                    <PaymentSavedCardsFormPart />
                    <button onClick={() => this.setState({ addNew: true })} class="button transparent-with-border">
                        {t("Use another card")}
                    </button>
                </>
            }
        </div>
    </section>
    <ReactTooltip place="top" type="dark" effect="solid" />
</div>
        );
    }
}

export default PaymentPage;
