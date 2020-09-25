export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currency, currencyOrObject.netTotal || currencyOrObject.amount);

    var result = (value || 0).toLocaleString(undefined, {
        style: "currency",
        currency: currencyOrObject || "USD"
    });

    if (result.substr(0,2) == "US") {
        result = "$" + result.substr(3);
    }

    return " " + result + " ";
};
