import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { price, Loader } from "simple";
import {
    allowedTypes,
    decorateExpirationDate,
    decorateCardholderName,
    prettyCardNumber
} from "tasks/payment/decorator";
import { FieldText, FieldCheckbox } from "components/form";
import { creditCardValidator } from "components/form/validation";
import { creditCardType } from "card-validator";

@observer
class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            everSubmitted: false,
            loading: false,
            code: {
                name: "CVV",
                size: 3
            }
        };
    }

    detectCardType = (e) => {
        var info = creditCardType(e.target?.value)?.[0];
        if (!e.target?.value || !info) {
            this.setState({
                type: null
            });
            return;
        }

        this.setState({
            code: info.code,
            type: info.type
        });

        e.target.value = prettyCardNumber(e.target.value, info);
    };

    submit = async (values) => {
        this.setState({
            everSubmitted: true,
            loading: true
        });

        const { pay } = this.props;
        pay(values)
            .catch(
                () => this.setState({
                    loading: false
                })
            );
    };

    render () {
        var { t } = useTranslation();
        const {
            hideCardSaveCheckbox,
            total,
            pay
        } = this.props;

        return (
            <Formik
                initialValues={{
                    card_number: "",
                    expiry_date: "",
                    card_security_code: "",
                    card_holder_name: "",
                    remember_me: false,
                    code_length: 3
                }}
                validateOnChange={true}
                validationSchema={creditCardValidator}
                onSubmit={this.submit}
            >
            {formik => (
                <form
                    onSubmit={formik.handleSubmit}
                    class={__class(!this.state.everSubmitted, "never-submitted")}
                >
                    { this.state.loading && <Loader page /> }
                    <div class="form">
                        <div class="row">
                            <FieldText
                                formik={formik}
                                id="card_holder_name"
                                label={t("Card Holder Name")}
                                placeholder={t("Card Holder Name")}
                                onChange={decorateCardholderName}
                                autocomplete="cc-name"
                                required={formik.values.remember_me}
                            />
                        </div>
                        <div class="row">
                            <FieldText
                                formik={formik}
                                id="card_number"
                                label={t("Card Number")}
                                placeholder={t("Card Number")}
                                required
                                numeric="/"
                                maxLength={22}
                                onChange={this.detectCardType}
                                Icon={allowedTypes[this.state.type] ? <img src={allowedTypes[this.state.type]} alt="" /> : null}
                                autocomplete="cc-number"
                            />
                        </div>
                        <div class="row">
                            <FieldText
                                formik={formik}
                                id="expiry_date"
                                label={t("Expiration Date")}
                                placeholder="MM/YY"
                                addClass="size-half"
                                required
                                numeric="/"
                                onChange={decorateExpirationDate}
                                maxLength={5}
                                autocomplete="cc-exp"
                            />
                            <FieldText
                                formik={formik}
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
                                addClass={"size-half" +
                                    __class(formik.values.card_security_code.length != this.state.code.size, "force-invalid")}
                                required
                                numeric
                                maxLength={this.state.code.size}
                                autocomplete="cc-csc"
                            />
                        </div>
                        { !hideCardSaveCheckbox && <div class="row">
                            <FieldCheckbox
                                formik={formik}
                                id="remember_me"
                                label={
                                    <span>
                                        {t("Save my card for faster checkout")}
                                        <span
                                            class="icon icon-info"
                                            data-tip={t("Your information is secure; only a part of you card's data will be stored")}
                                        />
                                    </span>
                                }
                            />
                        </div> }
                        <button type="submit" class="button">
                            <span class="icon icon-white-lock" />
                            { t("Pay") + price(total) }
                        </button>
                    </div>
                </form>
            )}
            </Formik>
        );
    }
}

export default PaymentForm;
