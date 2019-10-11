import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, API } from "core";
import { Formik } from "formik";
import {
    FieldText,
    FieldSwitch
} from "components/form";
import { Dual } from "components/simple";
import store from "stores/accommodation-store";
import { creditCardValidator } from "components/form/validation";

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
        values = {
            ...values,
            card_number: values.card_number.replace(/\D/g,''),
            expiry_date: values.expiry_date.replace(/\D/g,'')
        };
        postVirtualForm(this.state.RequestUrl, {
            ...this.state.service,
            ...values,
            remember_me: values.remember_me ? "YES" : "NO"
        });
    }

render() {
    const { t } = useTranslation();

    var result  = store.booking.result;

    return (
        <div class="confirmation block">
            <section class="double-sections">
                <div class="middle-section">
                    <h2 class="payment-title">
                        {t("Payment")}
                    </h2>

                    <Formik
                        initialValues={{
                            card_number: "",
                            expiry_date: "",
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
                                        id="card_number"
                                        label={t("Card number")}
                                        placeholder={t("Card number")}
                                        required
                                        clearable
                                    />
                                </div>
                                <div class="row">
                                    <FieldText formik={formik}
                                        id="expiry_date"
                                        label={t("Expiry date")}
                                        placeholder={t("Expiry date")}
                                        addClass="size-half"
                                        required
                                        clearable
                                    />
                                    <FieldText formik={formik}
                                        id="card_security_code"
                                        label={t("Card security code")}
                                        placeholder={t("Card security code")}
                                        addClass="size-half"
                                        required
                                        clearable
                                    />
                                </div>
                                <div class="row">
                                    <FieldText formik={formik}
                                        id="card_holder_name"
                                        label={t("Card holder name")}
                                        placeholder={t("Card holder name")}
                                        required
                                        clearable
                                    />
                                </div>
                                <div class="actions">
                                    <div class="row">
                                        <div class="vertical-label">
                                            <div>{t("Remember card")}</div>
                                        </div>
                                        <FieldSwitch formik={formik}
                                            id={"remember_me"}
                                        />
                                    </div>
                                    <button class="button green">
                                        {t("Confirm")}
                                    </button>
                                </div>
                            </div>
                        </form>
                        )}
                    />

                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong>{result?.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t("Status")}: <strong>{result.status}</strong>
                            </div>
                        </div>
                    </div>

                    <Dual
                        a={<Dual addClass="line"
                                a={"Check In Date"}
                                b={dateFormat.a(result.checkInDate)}
                            />}
                        b={<Dual addClass="line"
                                a={"Check Out Date"}
                                b={dateFormat.a(result.checkOutDate)}
                            />}
                    />
                    <Dual addClass="line"
                        a={"Within deadline"}
                        b={dateFormat.a(result.deadline)}
                    />
                    <Dual addClass="line"
                        a={"Room type"}
                        b={store.selected.variant.rooms[0].type}
                    />
                    <Dual addClass="line"
                        a={t('Total Cost')}
                        b={`${store.selected.variant.currencyCode} ${store.selected.variant.price.total}` /* todo: rebind result data */}
                    />
                </div>
            </section>
        </div>
    );
}
}

export default PaymentPage;
