import * as Yup from "yup";

const validator = {
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
};

export default Yup.object().shape(validator);

export const registrationUserValidatorWithEmail = Yup.object().shape({
    ...validator,
    email: Yup.string()
        .email("Invalid email")
        .required("Required"),
});
