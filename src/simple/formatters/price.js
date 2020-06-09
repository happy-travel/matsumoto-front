export const price = (currencyOrObject, value) => {
    if (undefined === value && currencyOrObject)
        return price(currencyOrObject.currency, currencyOrObject.netTotal || currencyOrObject.amount);
    return " " + (currencyOrObject || "") + String.fromCharCode(160) + (value || 0).toFixed(2) + " ";
};
