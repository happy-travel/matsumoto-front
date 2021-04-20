import React, {useState} from "react";
import { getIn } from "formik";

const FieldSwitch = ({
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
            onChange();
    };

    return (
        <>
            <div onClick={changing} className={"switch-control" + __class(checked, "active")} />
            { label &&
                <div onClick={changing} className="vertical-label">
                    {label}
                </div>
            }
        </>
    );
};

export default FieldSwitch;
