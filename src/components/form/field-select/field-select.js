import React from "react";
import { getIn } from "formik";
import FieldText from "../field-text";
import FieldSelectDropdown from "./field-select-dropdown";

const getTextByValue = (formik, id, options) => {
    var value = getIn(formik?.values, id);

    if (formik && typeof value != "undefined")
        for (var i = 0; i < options.length; i++)
            if (options[i].value == value)
                return options[i].text;

    return null;
};

const FieldSelect = (props) => {
    const {
        formik,
        id,
        options,
        className,
        value
    } = props;

    const ValueObject = value || getTextByValue(formik, id, options);

    return (
        <FieldText
            {...props}
            AfterIcon={<span className="icon icon-arrow-expand"/>}
            className={"select" + __class(className)}
            Dropdown={FieldSelectDropdown}
            ValueObject={ValueObject}
            readOnly
        />
    );
};

export default FieldSelect;
