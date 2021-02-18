import * as Yup from "yup";

export default Yup.object().shape({
    room: Yup.array().of(Yup.object().shape({
        passengers: Yup.array().of(Yup.object().shape({
            title: Yup.string()
                .trim()
                .required('*'),
            firstName: Yup.string()
                .trim()
                .required('*'),
            lastName: Yup.string()
                .trim()
                .required('*'),
        }))
        .required('Not enough passengers')
    })),
    accepted: Yup.boolean().oneOf([true], 'Please accept Terms and Conditions')
});
