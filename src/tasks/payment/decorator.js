import { creditCardType, expirationDate } from "card-validator";
import { decorate } from "simple";

export const prettyCardNumber = (cardNumber, card) => {
    cardNumber = decorate.removeNonDigits(cardNumber);
    if (card) {
        var offsets = [].concat(0, card.gaps, cardNumber.length);
        var components = [];

        for (var i = 0; offsets[i] < cardNumber.length; i++) {
            var start = offsets[i];
            var end = Math.min(offsets[i + 1], cardNumber.length);
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
    var previous = e.target?.dataset?.previous || "",
        value = e.target?.value || "";

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
    var value = expirationDate(values.expiry_date),
        MM = value.month,
        YY = value.year;
    if (1 == MM.length) MM = "0" + MM;
    if (4 == YY.length) YY = YY.slice(-2);
    return YY + MM;
};

export const allowedTypes = {
    [creditCardType.types.VISA]: "/images/other/visa.png",
    [creditCardType.types.MASTERCARD]: "/images/other/mc.png",
    [creditCardType.types.AMERICAN_EXPRESS]: "/images/other/amex.png"
};
