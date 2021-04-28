import React from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { price } from "simple";
import { CachedForm, FieldSelect, FieldText } from "components/form";
import { transferBalanceValidator } from "components/form/validation";
import { $notifications, $personal } from "stores";

const generateOptions = (accounts) =>
    accounts.map(item => (
        {
            text: `Account #${item.id}: ${price(item.balance)}`,
            value: item.id
        }
    ));

const ChildAgencyTransferBalancePart = ({
    payer,
    recipient,
    onUpdate
}) => {
    const { t } = useTranslation();

    const submit = (values, formik) => {
        API.post({
            url: API.CHILD_AGENCY_TRANSFER_ACCOUNT_FUNDS(values.payerId, values.recipientId),
            body: values,
            success: () => {
                onUpdate();
                formik.resetForm();
                $notifications.addNotification(`${price(values)} transferred!`, "Completed!", "success");
            }
        });
    };

    if (!$personal.permitted("AgencyToChildTransfer"))
        return null;

    return (
        <div>
            <h2>{t("Transfer Balance")}</h2>
            <CachedForm
                onSubmit={submit}
                initialValues={{
                    payerId: payer?.length == 1 ? payer[0].id : "",
                    recipientId: recipient?.length == 1 ? recipient[0].id : "",
                    amount: "",
                    currency: "USD"
                }}
                validationSchema={transferBalanceValidator}
                render={formik => (
                    <div className="form" style={{ width: 400 }}>
                        <div className="row">
                            <FieldSelect
                                formik={formik}
                                id="payerId"
                                label={t("From Account")}
                                placeholder="Please Select"
                                required
                                options={generateOptions(payer)}
                            />
                        </div>
                        <div className="row">
                            <FieldSelect
                                formik={formik}
                                id="recipientId"
                                label={t("To Account")}
                                placeholder="Please Select"
                                required
                                options={generateOptions(recipient)}
                            />
                        </div>
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
};

export default ChildAgencyTransferBalancePart;
