import * as Yup from "yup";

export default Yup.object().shape({
    destination: Yup.string()
        .required("*"),
    residency: Yup.string()
        .required("*"),
    nationality: Yup.string()
        .required("*"),
    destinationSelected: Yup.bool().oneOf([true]),
    nationalitySelected: Yup.bool().oneOf([true]),
    residencySelected: Yup.bool().oneOf([true]),
});
