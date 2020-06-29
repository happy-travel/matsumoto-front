export const decorate = {
    cutFirstPart: (str, firstPart) => {
        firstPart+="";
        if (!firstPart || !str)
            return '';
        if (str.slice(0, firstPart.length).toUpperCase() == firstPart.toUpperCase())
            return str.slice(firstPart.length, str.length);
        return '';
    },
    removeNonDigits: str => typeof str === "string" ? str.replace(/\D/g, "") : ""
};
