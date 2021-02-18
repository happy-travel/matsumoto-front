import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import { Dual, price } from "simple";
import ViewFailed from "parts/view-failed";
import paymentStore from "stores/payment-store";
import { Link } from "react-router-dom";

const messageFormatter = str => str.split("+").join(" ");

@observer
class DirectLinkConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            booking: {}
        }
    }

    componentDidMount() {
        var code = windowLocalStorage.get(paymentStore.subject.referenceCode);
        if (!code)
            this.setState({ booking: { error: "error" } });
        API.get({
            external_url: API.DIRECT_LINK_PAY.GET_INFO(code),
            after: result => {
                this.setState({ booking: result || { error: "error" } });
            }
        });
    }

render() {
    const { t } = useTranslation();

    const { status, error } = (paymentStore.paymentResult),
        subject = paymentStore.subject,
        { booking } = this.state;

return (
<>
    <header>
        <section>
            <div class="logo-wrapper">
                <Link to="/" class="logo" />
            </div>
        </section>
    </header>

    <div class="confirmation nova block">
        <section class="double-sections">
            { "Success" == status ?
            <div class="middle-section">
                <h2>{t("Order has been paid successfully")}</h2>

                <div class="accent-frame">
                    <div class="before">
                        <span class="icon icon-white-check" />
                    </div>
                    <div class="dual">
                        <div class="first">
                            {t("Order reference number")}: <strong class="green">{subject.referenceCode}</strong>
                        </div>
                        <div class="second">
                            {t("Payment result")}: <strong class={status}>{status}</strong>
                        </div>
                    </div>
                </div>

                <div class="part">
                    <div class="icon-holder">
                        <span class="icon icon-confirmation-price"/>
                    </div>
                    <div class="line">
                        <Dual
                            a={t("Amount")}
                            b={ price(subject.price) }
                        />
                    </div>
                </div>

                { booking.comment && <div class="part">
                    <div class="line">
                        <div class="icon-holder">
                            <span class="icon icon-confirmation-hotel"/>
                        </div>
                        <Dual addClass="line"
                              a={t('Additional Information')}
                              b={booking.comment}
                        />
                    </div>
                </div> }

            </div>
            :
            <div class="middle-section">
                { error && <div class="accent-frame error">
                    <div class="before">
                        <span class="icon icon-close white" />
                    </div>
                    <div class="dual">
                        <div class="first">
                            {t("Payment message")}: <strong>{messageFormatter(error)}</strong>
                        </div>
                    </div>
                </div> }
                <ViewFailed
                    reason={
                        <>
                            {t("Payment failed")}<br/>
                            {error}
                        </>
                    }
                />
            </div>
            }
        </section>
    </div>
</>
    );
}
}

export default DirectLinkConfirmationPage;
