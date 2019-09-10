import * as Yup from "yup";

export default Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Too short")
        .max(50, "Too long")
        .required("Required"),
    lastName: Yup.string()
        .min(2, "Too short")
        .max(50, "Too long")
        .required("Required"),
    title: Yup.string()
        .required("Required"),
    position: Yup.string()
        .required("Required"),
});
