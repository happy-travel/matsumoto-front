import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API, session } from "core";

import { Dual, Header } from "components/simple";

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
        var code = session.get(store.paymentResult.params.merchant_reference);
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
    <Header />

    <div class="confirmation block">
        <section class="double-sections">
            <div class="middle-section">

                { params_error && <div class="result-code error">
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

                <div class={"result-code" + (result.error ? " error" : "")}>
                    { (result.status || result.error) && <div class="before">
                        { result.error ? <span class="icon icon-close white" /> : <span class="icon icon-white-check" /> }
                    </div> }
                    <div class="dual">
                        <div class="first">
                            {t("Payment result")}: <strong>{result.status || result.error}</strong>
                        </div>
                    </div>
                </div>

                <Dual addClass="line"
                    a={t('Order reference number')}
                    b={booking.referenceCode}
                />

                <Dual addClass="line"
                    a={t('Amount')}
                    b={ price(booking.currency, booking.amount || 0) }
                />

                <Dual addClass="line"
                    a={t('Order status')}
                    b={booking.paymentStatus}
                />

                <Dual addClass="line"
                    a={t('Additional Information')}
                    b={booking.comment}
                />

            </div>
        </section>
    </div>
</React.Fragment>
    );
}
}

export default DirectLinkConfirmationPage;
