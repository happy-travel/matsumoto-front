import React from "react";
import settings from "settings";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API } from "core";
import { Formik } from "formik";
import {
    FieldText,
    FieldCheckbox
} from "components/form";
import { Dual, Header } from "components/simple";
import store from "stores/accommodation-store";
import { creditCardValidator } from "components/form/validation";
import Breadcrumbs from "components/breadcrumbs";

const postVirtualForm = (path, values) => {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);
    for (var key in values)
        if (values.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", values[key]);
            form.appendChild(hiddenField);
        }
    document.body.appendChild(form);
    form.submit();
};

const formatExpiryDate = (values) => {
    var MM = values.expiry_month.replace(/\D/g,''),
        YY = values.expiry_year.replace(/\D/g,'');
    if (1 == MM.length) MM = "0" + MM;
    if (4 == YY.length) YY = YY.slice(-2);
    return YY + MM;
};

@observer
class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            request_url: null,
            currency: store.selected?.variant?.price.currencyCode,
            amount: store.selected?.variant?.price.netTotal,
            comment: null,
            service: {
                service_command     : "TOKENIZATION",
                merchant_reference  : require('uuid/v4')(),
                language            : "en", //the only alternative : "ar"
                return_url          : settings.payment_any_cb_host + "/payment/result/" + store.booking?.result?.referenceCode
            }
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        API.get({
            url: API.CARDS_SETTINGS,
            after: data => {
                this.setState({
                    service: {
                        ...this.state.service,
                        access_code         : data.accessCode,
                        merchant_identifier : data.merchantIdentifier
                    },
                    request_url: data.tokenizationUrl
                });
            }
        });
        this.snare();
    }

    snare() {
        window.io_bbout_element_id = "device_fingerprint";
        window.io_install_stm = false;
        window.io_exclude_stm = 0;
        window.io_install_flash = false;
        window.io_enable_rip = true;

        var script = document.createElement("script");
        script.src = "https://mpsnare.iesnare.com/snare.js";
        script.async = true;
        document.body.appendChild(script);
    }

    submit(values) {
        var request = {
            card_holder_name: values.card_holder_name,
            card_security_code: values.card_security_code,
            card_number: values.card_number.replace(/\D/g,''),
            expiry_date: formatExpiryDate(values),
            remember_me: values.remember_me ? "YES" : "NO"
        };

        var fingerprint = this.state.direct ? "" : (document.getElementById("device_fingerprint")?.value || "");
        this.setState({
            service: {
                ...this.state.service,
                ...(fingerprint ? { device_fingerprint: fingerprint } : {})
            }
        });

        API.post({
            url: this.state.direct ? null : API.CARDS_SIGN,
            external_url: this.state.direct ? API.DIRECT_LINK_PAY.SIGN(this.state.order_code) : null,
            body: this.state.service,
            after: data => {
                postVirtualForm(this.state.request_url, {
                    ...this.state.service,
                    ...request,
                    signature: data
                });
            }
        });
    }

render() {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            { this.state.direct && <Header /> }

<div class="confirmation block payment">
    <section class="double-sections">
        <div class="middle-section">
            { !this.state.direct &&
            <Breadcrumbs items={[
                {
                    text: t("Search accommodation"),
                    link: "/search"
                }, {
                    text: t("Your Booking")
                }, {
                    text: t("Payment")
                }
            ]}/>
            }
            { this.state.comment && <p>
                { this.state.comment }
            </p> }

            <h2 class="payment-title">
                {t("Please Enter Your Card Details")}
            </h2>

            <Formik
                initialValues={{
                    card_number: "",
                    expiry_month: "",
                    expiry_year: "",
                    card_security_code: "",
                    card_holder_name: "",
                    remember_me: false
                }}
                validationSchema={creditCardValidator}
                onSubmit={this.submit}
                render={formik => (
                <form onSubmit={formik.handleSubmit}>
                    <div class="form">
                        <div class="row">
                            <FieldText formik={formik}
                                id="card_holder_name"
                                label={t("Card Holder Name")}
                                placeholder={t("Card Holder Name")}
                                clearable
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id="card_number"
                                label={t("Card Number")}
                                placeholder={t("Card Number")}
                                required
                                clearable
                                maxLength={40}
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id="expiry_month"
                                label={t("Expiration Date")}
                                placeholder={"MM"}
                                addClass="size-fourth label-long after-slash"
                                required
                                numeric
                                maxLength={2}
                            />
                            <FieldText formik={formik}
                                id="expiry_year"
                                label={<div/>}
                                placeholder={"YY"}
                                addClass="size-fourth"
                                numeric
                                maxLength={4}
                            />
                            <FieldText formik={formik}
                                id="card_security_code"
                                password
                                label={t("CCV")}
                                placeholder={t("CCV")}
                                addClass="size-half"
                                required
                                clearable
                                numeric
                                maxLength={3}
                            />
                        </div>
                        <div class="row hide">
                            <FieldCheckbox formik={formik}
                                label={"Save my card for faster checkout"}
                                id={"remember_me"}
                            />
                        </div>
                        <button class="button">
                            <span class="icon icon-white-lock" />
                            { t("Pay") + price(this.state.currency, this.state.amount) }
                        </button>
                    </div>
                </form>
                )}
            />
        </div>
    </section>
    <input type="hidden" id="device_fingerprint" name="device_fingerprint" />
</div>

        </React.Fragment>
    );
}
}

export default PaymentPage;
