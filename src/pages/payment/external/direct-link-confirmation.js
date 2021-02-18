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
            <div className="logo-wrapper">
                <Link to="/" className="logo" />
            </div>
        </section>
    </header>

    <div className="confirmation nova block">
        <section className="double-sections">
            { "Success" == status ?
            <div className="middle-section">
                <h2>{t("Order has been paid successfully")}</h2>

                <div className="accent-frame">
                    <div className="before">
                        <span className="icon icon-white-check" />
                    </div>
                    <div className="dual">
                        <div className="first">
                            {t("Order reference number")}: <strong className="green">{subject.referenceCode}</strong>
                        </div>
                        <div className="second">
                            {t("Payment result")}: <strong className={status}>{status}</strong>
                        </div>
                    </div>
                </div>

                <div className="part">
                    <div className="icon-holder">
                        <span className="icon icon-confirmation-price"/>
                    </div>
                    <div className="line">
                        <Dual
                            a={t("Amount")}
                            b={ price(subject.price) }
                        />
                    </div>
                </div>

                { booking.comment && <div className="part">
                    <div className="line">
                        <div className="icon-holder">
                            <span className="icon icon-confirmation-hotel"/>
                        </div>
                        <Dual className="line"
                              a={t('Additional Information')}
                              b={booking.comment}
                        />
                    </div>
                </div> }

            </div>
            :
            <div className="middle-section">
                { error && <div className="accent-frame error">
                    <div className="before">
                        <span className="icon icon-close white" />
                    </div>
                    <div className="dual">
                        <div className="first">
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
