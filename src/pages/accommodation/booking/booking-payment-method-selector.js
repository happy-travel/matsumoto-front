import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { FieldSelect } from "components/form";
import { API } from "core";
import { PAYMENT_METHODS } from "enum";
import { price } from "simple";
import { $payment, $personal } from "stores";

const BookingPaymentMethodSelector = observer(({ contractPaymentMethods }) => {
    const { t } = useTranslation();
    const { settings, balance } = $personal;
    const { paymentMethod } = $payment;

    useEffect(() => {
        if ($personal.permitted("ObserveBalance"))
            API.get({
                url: API.ACCOUNT_BALANCE("USD"),
                success: balance => $personal.setBalance(balance)
            });
        API.get({
            url: API.COUNTERPARTY_INFO,
            success: counterparty => {
                let newMethod = counterparty.preferredPaymentMethod;
                if (!contractPaymentMethods.includes(newMethod))
                    newMethod = PAYMENT_METHODS.CARD;
                $payment.setPaymentMethod(newMethod);
            }
        });
    }, []);

    const selectPaymentMethod = (method) => {
        $payment.setPaymentMethod(method)
    };

    let options = [];

    if (contractPaymentMethods.includes(PAYMENT_METHODS.ACCOUNT))
        options.push({
            value: PAYMENT_METHODS.ACCOUNT,
            text: (
                <>
                    {t("Account balance")}{" "}
                    { (settings.availableCredit === true) && $personal.permitted("ObserveBalance") &&
                        <span className="balance">
                            {"(" + price(balance?.currency, balance?.balance).trim() + ")"}
                        </span>
                    }
                </>
            )
        });

    if (contractPaymentMethods.includes(PAYMENT_METHODS.CARD))
        options.push({
            value: PAYMENT_METHODS.CARD,
            text: (
                <>
                    {t("Credit or Debit Card")}
                    <img src="/images/other/mc.png" alt="Mastercard" />
                    <img src="/images/other/visa.png" alt="Visa" />
                    <img src="/images/other/amex.png" alt="American Express" />
                </>
            )
        });

    if (contractPaymentMethods.includes(PAYMENT_METHODS.OFFLINE))
        options.push({
            value: PAYMENT_METHODS.OFFLINE,
            text: (
                <>
                    {t("Pay Later")} <span>({t("Offline")})</span>
                </>
            )
        });

    return (
        <>
            <h4>{t("Select Payment Method")}</h4>
            <div className="form">
                <FieldSelect
                    id="payment-method"
                    className="payment-methods"
                    placeholder={t("Select Payment Method")}
                    value={options.find(item => item.value === paymentMethod)?.text}
                    options={options}
                    setValue={selectPaymentMethod}
                />
            </div>
        </>
    );
});

export default BookingPaymentMethodSelector;
