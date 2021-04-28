import { creditCardType, expirationDate } from "card-validator";
import { decorate } from "simple";

export const prettyCardNumber = (cardNumber, card) => {
    cardNumber = decorate.removeNonDigits(cardNumber);
    if (card) {
        let offsets = [].concat(0, card.gaps, cardNumber.length);
        let components = [];

        for (let i = 0; offsets[i] < cardNumber.length; i++) {
            const start = offsets[i];
            const end = Math.min(offsets[i + 1], cardNumber.length);

            components.push(cardNumber.substring(start, end));
        }

        return components.join(' ');
    }
    return cardNumber;
};

export const decorateCardholderName = (e) => {
    e.target.value = e.target?.value?.toUpperCase() || e.target.value;
};

export const decorateExpirationDate = (e) => {
    const previous = e.target?.dataset?.previous || "";
    let value = e.target?.value || "";

    if ((previous.slice(-1) == "/") && (value.length == 2) && (previous.length == 3))
        return;

    e.target.value = value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/'
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/'
    ).replace(
        /^1([3-9])$/g, '01/$1'
    ).replace(
        /^0\/|0+$/g, '0'
    ).replace(
        /[^\d|^\/]*/g, ''
    ).replace(
        /\/\//g, '/'
    );

    value = e.target.value;
    if (value.indexOf("/") == -1 && value.length > 2) {
        e.target.value = value.substr(0, 2) + "/" + value.substr(2);
    }

    e.target.dataset.previous = e.target.value;
};

export const formatExpiryDate = (values) => {
    const value = expirationDate(values.expiry_date);
    let MM = value.month;
    let YY = value.year;

    if (1 == MM.length) MM = "0" + MM;
    if (4 == YY.length) YY = YY.slice(-2);
    return YY + MM;
};

export const allowedTypes = {
    [creditCardType.types.VISA]: "/images/other/visa.png",
    [creditCardType.types.MASTERCARD]: "/images/other/mc.png",
    [creditCardType.types.AMERICAN_EXPRESS]: "/images/other/amex.png"
};
