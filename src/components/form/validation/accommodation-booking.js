import * as Yup from "yup";

export default Yup.object().shape({
    "passenger-title":  Yup.array().of(Yup.string()
                                    .max(250, "Too long")
                                    .required("Required")),
    "passenger-first-name": Yup.array().of(Yup.string()
                                    .max(250, "Too long")
                                    .required("Required")),
    "passenger-last-name": Yup.array().of(Yup.string()
                                    .max(250, "Too long")
                                    .required("Required")),
    accepted: Yup.boolean().oneOf([true], 'Please accept Terms and Conditions'),
});
