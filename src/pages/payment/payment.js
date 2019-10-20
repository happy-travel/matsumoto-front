import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, price, API } from "core";
import { Formik } from "formik";
import {
    FieldText,
    FieldCheckbox
} from "components/form";
import { Dual } from "components/simple";
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
            RequestUrl: null,
            service: {
                service_command     : "TOKENIZATION",
                merchant_reference  : require('uuid/v4')(),
                language            : "en", //the only alternative : "ar"
                return_url          : window.location.origin + "/payment/result/" + store.booking.result.referenceCode
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
                        merchant_identifier : data.merchantIdentifier,
                    },
                    RequestUrl: data.tokenizationUrl
                });
                API.post({
                    url: API.CARDS_REQUEST,
                    body: this.state.service,
                    after: data => {
                        this.setState({
                            service: {
                                ...this.state.service,
                                signature: data
                            }
                        })
                    }
                });
            }
        });
    }

    submit(values) {
        var request = {
            card_holder_name: values.card_holder_name,
            card_security_code: values.card_security_code,
            card_number: values.card_number.replace(/\D/g,''),
            expiry_date: formatExpiryDate(values),
            remember_me: values.remember_me ? "YES" : "NO"
        };
        postVirtualForm(this.state.RequestUrl, {
            ...this.state.service,
            ...request
        });
    }

render() {
    const { t } = useTranslation();

    return (
<div class="confirmation block payment">
    <section class="double-sections">
        <div class="middle-section">
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
                                required
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
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id="expiry_month"
                                label={t("Expiration Date")}
                                placeholder={"MM"}
                                addClass="size-fourth label-long after-slash"
                                required
                            />
                            <FieldText formik={formik}
                                id="expiry_year"
                                label={<div/>}
                                placeholder={"YY"}
                                addClass="size-fourth"
                            />
                            <FieldText formik={formik}
                                id="card_security_code"
                                label={t("CCV")}
                                placeholder={t("CCV")}
                                addClass="size-half"
                                required
                                clearable
                            />
                        </div>
                        <div class="row">
                            <FieldCheckbox formik={formik}
                                label={"Save my card for faster checkout"}
                                id={"remember_me"}
                            />
                        </div>
                        <button class="button">
                            <span class="icon icon-white-lock" />
                            { t("Pay") + price(store.selected.variant.currencyCode, store.selected.variant.price.total) }
                        </button>
                    </div>
                </form>
                )}
            />
        </div>
    </section>
</div>
    );
}
}

export default PaymentPage;
