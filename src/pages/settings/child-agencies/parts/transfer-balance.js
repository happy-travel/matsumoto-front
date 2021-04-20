import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { price } from "simple";
import { CachedForm, FieldSelect, FieldText } from "components/form";
import { transferBalanceValidator } from "components/form/validation";
import { $personal } from "stores";

@observer
export default class ChildAgencyTransferBalancePart extends React.Component {
    componentDidMount() {
        this.updateBalance();
    }

    updateBalance = () => {
        if ($personal.permitted("ObserveBalance"))
            API.get({
                url: API.ACCOUNT_BALANCE("USD"),
                success: balance => $personal.setBalance(balance)
            });
    };

    submit = (values, formik) => {
        const { payerAccountId, recipient, onUpdate } = this.props;

        API.post({
            url: API.CHILD_AGENCY_TRANSFER_ACCOUNT_FUNDS(payerAccountId, recipient.id),
            body: values,
            success: () => {
                this.updateBalance();
                onUpdate();
                formik.resetForm();
            }
        });
    };

    render() {
        const { t } = useTranslation();
        const { recipient } = this.props;

        return (
            <div>
                <h2>{t("Transfer Balance")}</h2>
                <div className="row">
                    <b>{t("Your Balance")}</b>:{" "}
                    {price($personal.balance?.currency, $personal.balance?.balance)}
                </div>
                <div className="row">
                    <b>{t("Child Agency Account Balance")}</b>:{" "}
                    {price(recipient.accountBalance)}
                </div>
                <CachedForm
                    onSubmit={this.submit}
                    initialValues={{
                        amount: "",
                        currency: "USD"
                    }}
                    validationSchema={transferBalanceValidator}
                    render={formik => (
                        <div className="form" style={{ width: 400 }}>
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="amount"
                                    label="Amount"
                                    placeholder="Amount"
                                    numeric
                                />
                            </div>
                            <div className="row">
                                <FieldSelect
                                    formik={formik}
                                    id="currency"
                                    label={t("Currency")}
                                    required
                                    options={[
                                        { value: "USD", text: "USD"},
                                        { value: "EUR", text: "EUR"},
                                        { value: "AED", text: "AED"},
                                        { value: "SAR", text: "SAR"}
                                    ]}
                                />
                            </div>
                            <div className="row">
                                <button type="submit" className="button" style={{ width: "100%" }}>
                                    {t("Transfer")}
                                </button>
                            </div>
                        </div>
                    )}
                />
            </div>
        );
    }
}
