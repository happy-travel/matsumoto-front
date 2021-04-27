import React, { useState, useEffect } from "react";
import { FieldText } from "components/form";
import DateDropdown from "./dropdown-datepicker";
import { date } from "simple";

const FieldDatepicker = ({
    formik,
    first,
    second,
    short,
    onChange,
    disabled,
    id,
    label,
    placeholder,
    className
}) => {
    const generateText = () => {
        if (formik.values[first] || formik.values[second])
            return (
                date.format[short ? "shortDay" : "c"](formik.values[first])
                + " – " +
                date.format[short ? "shortDay" : "c"](formik.values[second])
            );
        return "";
    };

    const [text, setText] = useState(generateText());

    const setValue = ([from, to]) => {
        formik.setFieldValue(first, from);
        formik.setFieldValue(second, to);
        if (onChange)
            onChange();
    };

    const inputChanged = (event) => {
        let currentValue = event.target.value.replace(/[^0-9.,\/\- –]/g, "");
        setText(currentValue);
        const parseResult = date.parseDateRangeFromString(currentValue);
        if (parseResult)
            setValue(parseResult);
    };

    useEffect(() => {
        setText(generateText());
    }, [formik.values[first], formik.values[second]])

    return (
        <FieldText
            noInput={short}
            ValueObject={short ? text : undefined}
            formik={formik}
            id={id}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            Icon={<span className="icon icon-search-calendar"/>}
            className={className || "size-medium"}
            Dropdown={DateDropdown}
            onChange={inputChanged}
            value={text}
            setValue={setValue}
            options={[
                new Date(formik.values[first]),
                new Date(formik.values[second])
            ]}
        />
    );
};

export default FieldDatepicker;
