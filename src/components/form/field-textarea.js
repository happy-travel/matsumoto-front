import React, { useState, useCallback } from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";

const FieldTextarea = observer(({
    label,
    placeholder,
    className,
    id,
    disabled,
    required,
    formik
}) => {
    const [focused, setFocused] = useState(false);
    const [everTouched, setEverTouched] = useState(false);
    const [everChanged, setEverChanged] = useState(false);

    const onFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const onKeyUp = (event) => {
        event.target.style.height = "1px";
        event.target.style.height = ( event.target.scrollHeight + 20 )+"px";
    };

    const blur = useCallback((event) => {
        setFocused(false);
        if (formik)
            formik.handleBlur(event);
        if (!everTouched)
            setEverTouched(true);
    }, []);

    const changing = useCallback((event) => {
        if (formik) {
            formik.setFieldTouched(id, true);
            formik.handleChange(event);
        }
        if (!everChanged)
            setEverChanged(true);
    },[]);

    const errorText = getIn(formik?.errors, id);
    const isFieldTouched = getIn(formik?.touched, id);
    const fieldValue = getIn(formik?.values, id);

    return (
        <div
            className={
                "field" +
                __class(className) +
                __class(focused, "focus") +
                __class(disabled, "disabled") +
                __class(errorText && isFieldTouched, "error") +
                __class(!errorText && fieldValue, "valid")
            }
        >
            <label>
                { label &&
                    <div className="label">
                        <span className={__class(required, "required")}>{label}</span>
                    </div>
                }
                <div className="input textarea">
                    { !disabled ?
                        <div className="inner">
                            <textarea
                                id={id}
                                placeholder={placeholder}
                                onFocus={onFocus}
                                onChange={changing}
                                onKeyUp={onKeyUp}
                                onBlur={blur}
                                value={fieldValue}
                            />
                        </div> :
                        <span className={"disabled" + __class(!fieldValue, "placeholder")}>
                            { fieldValue || placeholder}
                        </span>
                    }
                </div>
                { errorText?.length > 1 && isFieldTouched &&
                    <div className={
                        "error-holder" +
                        __class(!everTouched || !everChanged || focused, "possible-hide")
                    }>
                        {errorText}
                    </div>
                }
            </label>
        </div>
    );
});

export default FieldTextarea;
