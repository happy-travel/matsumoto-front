import * as Yup from "yup";

export default Yup.object().shape({
    destination: Yup.string()
        .required("*"),
    residency: Yup.string()
        .required("*"),
    nationality: Yup.string()
        .required("*"),
});
