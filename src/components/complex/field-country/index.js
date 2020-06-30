import FieldCountry from "./field-country";
import authStore from "stores/auth-store";

export const searchFormSetDefaultCountries = values => {
    if (!values.residency || !values.residencyCode) {
        values.residency = authStore.settings.residency || "";
        values.residencyCode = authStore.settings.residencyCode || "";
    }
    if (!values.nationality || !values.nationalityCode) {
        values.nationality = authStore.settings.nationality || "";
        values.nationalityCode = authStore.settings.nationalityCode || "";
    }
    return values;
};

export default FieldCountry;
