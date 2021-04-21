import React, { useState } from "react";
import { getIn } from "formik";
import InputRange from "react-input-range";
import { price } from "simple";

const FieldRangeSlider = ({ formik, min, max, id, onChange, currency, formatLabel }) =>  {
    const [value, setValue] = useState(getIn(formik?.values, id) || { min, max: max });

    const changing = (newValue) => {
        setValue(newValue);

        if (formik)
            formik.setFieldValue(id, newValue);
    };

    const changeComplete = () => {
        if (onChange)
            onChange();
    };

    if (!formatLabel)
        formatLabel = (v, label) =>
            ("max" == label && value[label] == 2500) ? "Any" : price(currency, value[label]);

    return (
        <InputRange
            maxValue={max}
            minValue={min}
            step={1}
            allowSameValues={true}
            formatLabel={formatLabel}
            value={value}
            onChange={changing}
            onChangeComplete={changeComplete}
        />
    );
};

export default FieldRangeSlider;
