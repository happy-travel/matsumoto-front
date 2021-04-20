const ALLOWED_CURRENCIES = ["USD", "AED"];

export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currency, currencyOrObject.finalPrice || currencyOrObject.amount);

    let currency = currencyOrObject;
    if (!ALLOWED_CURRENCIES.includes(currency))
        currency = ALLOWED_CURRENCIES[0];

    let result = (value || 0).toLocaleString(undefined, {
        style: "currency",
        currency
    });

    if (result.substr(0,2) == "US") {
        result = "$" + result.substr(3);
    }

    return " " + result + " ";
};
