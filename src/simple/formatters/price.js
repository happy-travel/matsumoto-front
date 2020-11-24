const ALLOWED_CURRENCIES = ["USD", "AED"];

export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currency, currencyOrObject.finalPrice || currencyOrObject.amount);

    var currency = currencyOrObject;
    if (ALLOWED_CURRENCIES.indexOf(currency) < 0)
        currency = ALLOWED_CURRENCIES[0];

    var result = (value || 0).toLocaleString(undefined, {
        style: "currency",
        currency
    });

    if (result.substr(0,2) == "US") {
        result = "$" + result.substr(3);
    }

    return " " + result + " ";
};
