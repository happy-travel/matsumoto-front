import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { price } from "simple";
import { Loader } from "components/simple";
import {
    allowedTypes,
    decorateExpirationDate,
    decorateCardholderName,
    prettyCardNumber
} from "tasks/payment/decorator";
import { FieldText, FieldCheckbox } from "components/form";
import { creditCardValidator } from "components/form/validation";
import { creditCardType } from "card-validator";

const PaymentForm = ({
    hideCardSaveCheckbox,
    total,
    pay
}) => {
    const [everSubmitted, setEverSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState({
        type: null,
        code: {
            name: "CVV",
            size: 3
        }
    });

    const detectCardType = (e) => {
        const info = creditCardType(e.target?.value)?.[0];
        if (!e.target?.value || !info)
            return;

        setCard({
            type: info.type,
            code: info.code
        });

        e.target.value = prettyCardNumber(e.target.value, info);
    };

    const submit = async (values) => {
        setEverSubmitted(true);
        setLoading(true);
        pay(values)
            .catch(
                () => setLoading(false)
            );
    };

    const { t } = useTranslation();

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
            onSubmit={submit}
        >
        {formik => (
            <form
                onSubmit={formik.handleSubmit}
                className={everSubmitted ? "" : "never-submitted"}
            >
                { loading && <Loader page /> }
                <div className="form">
                    <div className="row">
                        <FieldText
                            formik={formik}
                            id="card_holder_name"
                            label={t("Card Holder Name")}
                            placeholder={t("Card Holder Name")}
                            onChange={decorateCardholderName}
                            autoComplete="cc-name"
                            required={formik.values.remember_me}
                        />
                    </div>
                    <div className="row">
                        <FieldText
                            formik={formik}
                            id="card_number"
                            label={t("Card Number")}
                            placeholder={t("Card Number")}
                            required
                            numeric="/"
                            maxLength={22}
                            onChange={detectCardType}
                            AfterIcon={allowedTypes[card.type] ? <img src={allowedTypes[card.type]} alt="" /> : null}
                            autoComplete="cc-number"
                        />
                    </div>
                    <div className="row">
                        <FieldText
                            formik={formik}
                            id="expiry_date"
                            label={t("Expiration Date")}
                            placeholder="MM/YY"
                            className="size-half"
                            required
                            numeric="/"
                            onChange={decorateExpirationDate}
                            maxLength={5}
                            autoComplete="cc-exp"
                        />
                        <FieldText
                            formik={formik}
                            id="card_security_code"
                            password
                            label={
                                <>
                                    {card.code.name}
                                    <i
                                        className="icon icon-info"
                                        data-tip="Security code on your credit card"
                                    />
                                </>
                            }
                            placeholder={card.code.name}
                            className={"size-half" +
                                __class(formik.values.card_security_code.length != card.code.size, "force-incorrect")}
                            required
                            numeric
                            maxLength={card.code.size}
                            autoComplete="cc-csc"
                        />
                    </div>
                    { !hideCardSaveCheckbox && <div className="row">
                        <FieldCheckbox
                            formik={formik}
                            id="remember_me"
                            label={
                                <span>
                                    {t("Save my card for faster checkout")}
                                    <span
                                        className="icon icon-info"
                                        data-tip={t("Your information is secure; only a part of you card's data will be stored")}
                                    />
                                </span>
                            }
                        />
                    </div> }
                    <button type="submit" className="button main">
                        <span className="icon icon-white-lock" />
                        { t("Pay") + price(total) }
                    </button>
                </div>
            </form>
        )}
        </Formik>
    );
};

export default PaymentForm;
