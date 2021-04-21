const ALLOWED_CURRENCIES = ["USD", "AED"];

export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currency, currencyOrObject.finalPrice || currencyOrObject.amount);

    let currency = currencyOrObject;
    if (!ALLOWED_CURRENCIES.includes(currency))
        currency = ALLOWED_CURRENCIES[0];
    if (typeof value == "string")
        value = parseFloat(value);

    let result = (value || 0).toLocaleString(undefined, {
        style: "currency",
        currency
    });
    result = result.replace("US$", "$");

    return " " + result + " ";
};
