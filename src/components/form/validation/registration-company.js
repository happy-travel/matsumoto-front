import * as Yup from "yup";

export default Yup.object().shape({
    name: Yup.string()
        .min(2, "Too short")
        .max(50, "Too long")
        .required("Required"),
    address: Yup.string()
        .min(2, "Too short")
        .max(2000, "Too long")
        .required("Required"),
    zip: Yup.string(),
    country: Yup.string()
        .required("Required"),
    city: Yup.string()
        .required("Required"),
    preferredPaymentMethod: Yup.string()
        .required("Required"),
    preferredCurrency: Yup.string()
        .required("Required"),
    phone: Yup.string()
        .max(30, "Too long")
        .required("Required"),
    fax: Yup.string(),
    website: Yup.string(),
});