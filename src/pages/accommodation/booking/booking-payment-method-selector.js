import React , { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { FieldSelect } from "components/form";
import { API } from "core";
import { APR_VALUES, PAYMENT_METHODS } from "enum";
import { price } from "simple";
import { $accommodation, $payment, $personal } from "stores";

const BookingPaymentMethodSelector = observer(({}) => {
    const { t } = useTranslation();
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState(PAYMENT_METHODS.CREDIT_CARD_AND_VIRTUAL_ACCOUNT);
    const { settings, balance } = $personal;
    const { paymentMethod } = $payment;

    useEffect(() => {
        API.get({
            url: API.AGENCY_PAYMENT_OPTION,
            success: availablePayments => setAvailablePaymentMethods(availablePayments)
        });
        API.get({
            url: API.ACCOUNT_BALANCE("USD"),
            success: balance => $personal.setBalance(balance)
        });
        API.get({
            url: API.COUNTERPARTY_INFO,
            success: counterparty => $payment.setPaymentMethod(counterparty.preferredPaymentMethod)
        });
    }, []);

    const isAccountPaymentAvailable = () => {
        let APR = $accommodation.selected.roomContractSet?.isAdvancePurchaseRate;
        var result = (
            balance?.currency &&
            (balance.balance >= 0) &&
            !(APR && ($personal.agencyAPR < APR_VALUES.CardAndAccountPurchases)) &&
            (availablePaymentMethods != PAYMENT_METHODS.CARD)
        );

        if (!result && (PAYMENT_METHODS.ACCOUNT == paymentMethod)) {
            $payment.setPaymentMethod(PAYMENT_METHODS.CARD);
        }

        return result;
    };

    const selectPaymentMethod = (method) => {
        $payment.setPaymentMethod(method)
    };

    let options = [];

    if (isAccountPaymentAvailable())
        options.push({
            value: PAYMENT_METHODS.ACCOUNT,
            text: (
                <>
                    {t("Account balance")}{" "}
                    { settings.availableCredit === true &&
                        <span>
                            {"(" + price(balance?.currency, balance?.balance).trim() + ")"}
                        </span>
                    }
                </>
            )
        });

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

    return (
        <>
            <h4>{t("Select Payment Method")}</h4>

            <div className="form">
                <FieldSelect
                    id="payment-method"
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
