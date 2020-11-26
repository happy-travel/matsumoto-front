import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { windowSessionStorage } from "core/misc/window-storage";
import { Dual, StaticHeader, price } from "simple";
import ViewFailed from "parts/view-failed";

import store from "stores/accommodation-store";

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
        if (!store.paymentResult?.params?.merchant_reference) {
            this.setState({ booking: { error: "error" } });
            return;
        }

        var code = windowSessionStorage.get(store.paymentResult.params.merchant_reference);
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

    var {
        params,
        result,
        params_error
    } = (store.paymentResult || {}),

        booking = this.state.booking;

return (
<React.Fragment>
    <StaticHeader />

    <div class="confirmation nova block">
        <section class="double-sections">
            { !!result && "Success" == result.status ?
            <div class="middle-section">
                <h2>{t("Your order has been paid successfully")}</h2>

                <div class="accent-frame">
                    <div class="before">
                        <span class="icon icon-white-check" />
                    </div>
                    <div class="dual">
                        <div class="first">
                            {t("Order reference number")}: <strong class="green">{booking.referenceCode}</strong>
                        </div>
                        <div class="second">
                            {t("Payment result")}: <strong class={result.status}>{result.status}</strong>
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
                            b={ price(booking.currency, booking.amount || 0) || "" }
                        />
                        { booking.paymentStatus && <Dual addClass="grow"
                                                         a={t('Order status')}
                                                         b={booking.paymentStatus}
                        /> }
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
                { params_error && <div class="accent-frame error">
                    <div class="before">
                        <span class="icon icon-close white" />
                    </div>
                    <div class="dual">
                        <div class="first">
                            {t("Payment message")}: <strong>{messageFormatter(params?.response_message)}</strong>
                        </div>
                        <div class="second">
                            {t("Response code")}: <strong>{params?.response_code}</strong>
                        </div>
                    </div>
                </div> }
                <ViewFailed
                    reason={
                        <React.Fragment>
                            {t("Payment failed")}<br/>
                            {result?.error}
                        </React.Fragment>
                    }
                />
            </div>
            }
        </section>
    </div>
</React.Fragment>
    );
}
}

export default DirectLinkConfirmationPage;
