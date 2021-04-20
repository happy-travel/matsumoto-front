import React, {useState} from "react";
import { getIn } from "formik";

const FieldCheckbox = ({
    formik,
    id,
    label,
    onChange,
    value
}) => {
    const [checked, setChecked] = useState(value || (formik ? !!getIn(formik.values, id) : false));

    const changing = () => {
        let newValue = !checked;
        setChecked(newValue);

        if (formik) {
            formik.setFieldValue(id, newValue);
            formik.setFieldTouched(id, true);
        }

        if (onChange)
            onChange(newValue);
    };

    return (
        <div onClick={changing} className={"checkbox" + __class(checked, "on")}>
            {label}
        </div>
    );
};

export default FieldCheckbox;
