import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { creditCardType } from "card-validator";
import { price, Loader } from "simple";
import { allowedTypes } from "tasks/payment/decorator";
import { FieldText } from "components/form";
import { savedCreditCardValidator } from "components/form/validation";
import { removeSavedCard } from "tasks/payment/service";
import { payBySavedCard } from "tasks/payment/processing";
import paymentStore from "stores/payment-store";

@observer
class PaymentSavedCardsFormPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedCardId: 0
        };
    }

    selectCard = (id) => {
        this.setState({
            selectedCardId: id
        });
    };

    submit = (values) => {
        if (!this.state.selectedCardId)
            return;
        this.setState({
            loading: true
        });
        payBySavedCard(values, this.state.selectedCardId);
    };

    render () {
        var { t } = useTranslation();
        return (
            <div class="form">
                <Formik
                    initialValues={{
                        card_security_code: ""
                    }}
                    validateOnChange={true}
                    validationSchema={savedCreditCardValidator}
                    onSubmit={this.submit}
                >
                {formik => (
                    <form onSubmit={formik.handleSubmit}>
                        { this.state.loading && <Loader page /> }
                        <div class="payment method cards">
                            <div class="list">
                                {paymentStore.savedCards.map(item => {
                                    var type = creditCardType(item.number)?.[0];
                                    return (
                                        <div
                                            onClick={() => this.selectCard(item.id)}
                                            class={"item" + __class(item.id == this.state.selectedCardId, "selected")}
                                        >
                                            {allowedTypes[type.type] ? <img src={allowedTypes[type.type]} alt="" /> : null}
                                            {item.number} <span>{item.expirationDate.substr(2,2) + " / " + item.expirationDate.substr(0,2)}</span>
                                            <FieldText
                                                formik={formik}
                                                id="card_security_code"
                                                placeholder={type.code.name}
                                                addClass={"only-when-selected" + __class(formik.values.card_security_code.length != type.code.size, "force-invalid")}
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
                        <button type="submit" class={"no-margin button" + __class(!this.state.selectedCardId, "disabled")}>
                            <span class="icon icon-white-lock" />
                            { t("Pay") + price(paymentStore.subject.price) + t("using saved card")}
                        </button>
                    </form>
                )}
                </Formik>
            </div>
        );
    }
}

export default PaymentSavedCardsFormPart;
