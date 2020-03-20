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
import { creditCardType } from "card-validator";
import Breadcrumbs from "components/breadcrumbs";
import ReactTooltip from "react-tooltip";
import {
    prettyCardNumber,
    postVirtualForm,
    formatExpiryDate,
    allowedTypes,
    decorateExpirationDate,
    decorateCardholderName
} from "./utils/decorator";
import {
    snare
} from "./utils/snare";

@observer
class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            request_url: null,
            currency: store.selected?.agreement?.price.currency,
            amount: store.selected?.agreement?.price.netTotal,
            comment: null,
            service: {
                service_command     : "TOKENIZATION",
                merchant_reference  : require('uuid/v4')(),
                language            : "en", //the only alternative : "ar"
                return_url          : settings.payment_any_cb_host + "/payment/result/" + store.booking?.referenceCode
            },
            code: {
                name: "CVV",
                size: 3
            }
        };
        this.submit = this.submit.bind(this);
        this.detectCardType = this.detectCardType.bind(this);
    }

    componentDidMount() {
        API.get({
            url: API.CARDS_SETTINGS,
            after: data => {
                if (!data)
                    return;
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
        snare();
    }

    detectCardType(e) {
        var info = creditCardType(e.target?.value);
        if (!e.target?.value || !info?.[0]) {
            this.setState({
                type: null
            });
            return;
        }
        info = info[0];

        this.setState({
            code: info.code,
            type: info.type
        });

        e.target.value = prettyCardNumber(e.target.value, info);
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

            { "Success" == this.state.status && <h2 class="payment-title">
                {t("This order was successfully paid already")}
            </h2> }

            { this.state.direct && ("Success" != this.state.status) &&
              ("Created" != this.state.status) && <h2 class="payment-title">
                {t("You are not able to pay this order anymore")}
            </h2> }

            { (!this.state.direct || ("Created" == this.state.status)) && <React.Fragment>
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
                    validateOnChange={true}
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
                                    onChange={decorateCardholderName}
                                    autocomplete="cc-name"
                                />
                            </div>
                            <div class="row">
                                <FieldText formik={formik}
                                    id="card_number"
                                    label={t("Card Number")}
                                    placeholder={t("Card Number")}
                                    required
                                    numeric={"/"}
                                    maxLength={22}
                                    onChange={this.detectCardType}
                                    Icon={allowedTypes[this.state.type] ? <img src={allowedTypes[this.state.type]} /> : null}
                                    autocomplete="cc-number"
                                />
                            </div>
                            <div class="row">
                                <FieldText formik={formik}
                                    id="expiry_date"
                                    label={t("Expiration Date")}
                                    placeholder={"MM/YY"}
                                    addClass="size-half"
                                    required
                                    numeric={"/"}
                                    onChange={decorateExpirationDate}
                                    maxLength={5}
                                    autocomplete="cc-exp"
                                />
                                <FieldText formik={formik}
                                    id="card_security_code"
                                    password
                                    label={
                                        <span>
                                            {this.state.code.name}
                                            <span
                                                class="icon icon-info"
                                                data-tip="Security code on your credit card"
                                            />
                                        </span>
                                    }
                                    placeholder={this.state.code.name}
                                    addClass="size-half"
                                    required
                                    numeric
                                    maxLength={this.state.code.size}
                                    autocomplete="cc-csc"
                                />
                            </div>
                            <div class="row hide">
                                <FieldCheckbox formik={formik}
                                    label={
                                        <span>
                                            {t("Save my card for faster checkout")}
                                            <span
                                                class="icon icon-info"
                                                data-tip={t("It's safe, only a part of your card data will be stored")}
                                            />
                                        </span>
                                    }
                                    id={"remember_me"}
                                />
                            </div>
                            <button class="button">
                                <span class="icon icon-white-lock" />
                                { t("Pay") + price(this.state.currency, this.state.amount || 0) }
                            </button>
                        </div>
                    </form>
                    )}
                />
            </React.Fragment> }
        </div>
    </section>
    <input type="hidden" id="device_fingerprint" name="device_fingerprint" />
    <ReactTooltip place="top" type="dark" effect="solid"/>
</div>

        </React.Fragment>
    );
}
}

export default PaymentPage;
