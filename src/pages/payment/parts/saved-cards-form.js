import React, { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { creditCardType } from "card-validator";
import { price } from "simple";
import { Loader } from "components/simple";
import { allowedTypes } from "tasks/payment/decorator";
import { FieldText } from "components/form";
import { savedCreditCardValidator } from "components/form/validation";
import { removeSavedCard } from "tasks/payment/service";
import { payBySavedCard } from "tasks/payment/processing";
import { $payment } from "stores";

const PaymentSavedCardsFormPart = observer(() => {
    const [loading, setLoading] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(0);

    const submit = (values) => {
        if (!selectedCardId)
            return;
        setLoading(true);
        payBySavedCard(values, selectedCardId);
    };

    const { t } = useTranslation();
    return (
        <div className="form">
            <Formik
                initialValues={{
                    card_security_code: ""
                }}
                validateOnChange={true}
                validationSchema={savedCreditCardValidator}
                onSubmit={submit}
            >
            {formik => (
                <form onSubmit={formik.handleSubmit}>
                    { loading &&
                        <Loader page />
                    }
                    <div className="payment method cards">
                        <div className="list">
                            { $payment.savedCards.map((item, index) => {
                                let type = creditCardType(item.number)?.[0] || { type: "none", code: { name: "Code", size: 4 } };
                                return (
                                    <div
                                        onClick={() => setSelectedCardId(item.id)}
                                        className={"item" + __class(item.id == selectedCardId, "selected")}
                                        key={index}
                                    >
                                        { allowedTypes[type.type] ?
                                            <img src={allowedTypes[type.type]} alt="" /> :
                                            null
                                        }
                                        <span>
                                            {item.number}
                                        </span>
                                        <span>
                                            {item.expirationDate.substr(2,2) + " / " + item.expirationDate.substr(0,2)}
                                        </span>
                                        <FieldText
                                            formik={formik}
                                            id="card_security_code"
                                            placeholder="---"
                                            label={type.code.name}
                                            className={"only-when-selected" + __class(formik.values.card_security_code.length != type.code.size, "force-incorrect")}
                                            required
                                            password
                                            numeric
                                            maxLength={type.code.size}
                                        />
                                        <b
                                            className="only-when-selected link"
                                            onClick={() => removeSavedCard(item.id)}
                                        >
                                            Forget
                                        </b>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button type="submit" className={"main button" + __class(!selectedCardId, "disabled")}>
                        <span className="icon icon-white-lock" />
                        { t("Pay") + price($payment.subject.price) + t("using saved card")}
                    </button>
                </form>
            )}
            </Formik>
        </div>
    );
});

export default PaymentSavedCardsFormPart;
