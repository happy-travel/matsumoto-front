import * as Yup from "yup";

export default Yup.object().shape({
    room: Yup.array().of(Yup.object().shape({
        passengers: Yup.array().of(Yup.object().shape({
            title: Yup.string()
                .required('Required'),
            firstName: Yup.string()
                .required('Required'),
            lastName: Yup.string()
                .required('Required'),
        }))
        .required('Not enough passengers')
    }))
});
