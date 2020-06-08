import * as Yup from "yup";

export const emailForm =  {
    email: Yup.string()
        .email("Invalid email")
        .required("Required"),
};

const validator = {
    firstName: Yup.string()
        .max(50, "Too long")
        .required("Required"),
    lastName: Yup.string()
        .max(50, "Too long")
        .required("Required"),
    title: Yup.string()
        .required("Required"),
    position: Yup.string()
        .required("Required"),
};

export default Yup.object().shape(validator);

export const emailFormValidator = Yup.object().shape(emailForm);

export const registrationUserValidatorWithEmail = Yup.object().shape({
    ...validator,
    ...emailForm
});
