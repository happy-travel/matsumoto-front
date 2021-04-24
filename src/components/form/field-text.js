import React, { useState, useCallback, useRef } from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";
import { getLocale } from "core";
import { decorate, useDropdown } from "simple";

const FieldText = observer(({
    label,
    placeholder,
    Icon,
    AfterIcon,
    clearable,
    password,
    className,
    id,
    Dropdown,
    value,
    disabled,
    required,
    readOnly,
    options,
    ValueObject,
    maxLength,
    numeric,
    suggestion,
    formik,
    setValue,
    additionalFieldForValidation,
    autoComplete,
    onChange,
    onClear,
    noInput,
    onFocusChanged
}) => {
    const [focused, setFocusedState] = useState(false);
    const [optionIndex, setOptionIndex] = useState(null);
    const [everTouched, setEverTouched] = useState(false);
    const [everChanged, setEverChanged] = useState(false);

    const refElement = useRef(null);
    const refDropdown = useRef(null);
    let dropdownOpen, toggleDropdown;
    if (Dropdown) {
        [dropdownOpen, toggleDropdown] = useDropdown(refElement, refDropdown);
    }

    const setFocused = (newValue, onlyStyles) => {
        setFocusedState(newValue);
        if (onFocusChanged)
            onFocusChanged(newValue, onlyStyles);
    };

    const focus = useCallback(() => {
        if (Dropdown) {
            toggleDropdown(true);
            setOptionIndex(null);
        }
        setFocused(true);
    }, []);

    const blur = useCallback((event) => {
        if (formik)
            formik.handleBlur(event);
        if (!everTouched)
            setEverTouched(true);
        if (!Dropdown)
            setFocused(false);
    }, [suggestion]);

    const onKeyDown = (event) => {
        if (!Dropdown || !options?.length) return;

        const scroll = document.querySelectorAll(`[data-dropdown="${id}"] .scroll > div:not(.subtitle)`),
              scrollElem = document.querySelector(`[data-dropdown="${id}"] .scroll`);

        if (!scroll?.length)
            return;

        switch (event.key) {
            case "Enter":
            case "ArrowRight":
                if (optionIndex !== null || suggestion?.value) {
                    event.preventDefault();
                    setValue(optionIndex !== null ? options[optionIndex] : suggestion?.value, false);
                    setFocused(false, true);
                    toggleDropdown(false);
                }
                break;
            case "ArrowUp":
            case "ArrowDown":
                let newIndex = optionIndex === null ? options.length -1 : optionIndex - 1;
                if ("ArrowDown" === event.key) {
                    newIndex = optionIndex === null ? 0 : optionIndex + 1;
                }
                if (newIndex >= 0 && newIndex < options.length) {
                    setOptionIndex(newIndex);
                    scrollElem.scrollTo(0, scroll[newIndex]?.offsetTop - 20);
                }
                if (setValue)
                    setValue(options[optionIndex], true);
                break;
            default:
                return;
        }
    };

    const clear = useCallback(() => {
        if (formik) {
            formik.setFieldValue(id, "");
            formik.setFieldTouched(id, false);
            if (Dropdown)
                toggleDropdown(false);
            if (additionalFieldForValidation)
                formik.setFieldValue(additionalFieldForValidation, false);
        }
        if (onClear)
            onClear();
    },[]);

    const changing = useCallback((event) => {
        if (Dropdown) {
            toggleDropdown(true);
            setOptionIndex(null);
        }
        if (numeric)
            if ("/" == numeric)
                event.target.value = event.target.value.replace(/[^0-9.\/ ]/g, "");
            else
                event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        if (onChange)
            onChange(event, formik, id);
        if (formik) {
            formik.setFieldTouched(id, true);
            formik.handleChange(event);
        }
        if (!everChanged)
            setEverChanged(true);
    },[]);

    const dropdownSetValue = (...params) => {
        if (setValue)
            setValue(...params);
        setFocused(false, true);
        toggleDropdown(false);
    };

    const isFieldTouched = getIn(formik?.touched, id);
    const fieldValue = getIn(formik?.values, id);

    let suggestionText = decorate.cutFirstPart(suggestion?.text, fieldValue);
    /* todo: Remove this workaround when server rtl suggestions works correct */
    if (getLocale() == "ar")
        suggestionText = "";

    let errorText = getIn(formik?.errors, id);
    let additionalFieldError = additionalFieldForValidation && getIn(formik?.errors, additionalFieldForValidation);
    if (Dropdown && dropdownOpen) {
        errorText = "";
        additionalFieldError = "";
    }

    // todo: short search destination field workaround. rewrite in future
    if (noInput == "destination") {
        if (dropdownOpen) {
            noInput = false;
        } else {
            value = true;
            ValueObject = formik.values.destination;
        }
    }

    if (ValueObject !== undefined) {
        if (ValueObject)
            ValueObject = <div className="value-object">{ValueObject}</div>;
        else
            ValueObject = <div className="value-object placeholder">{placeholder}</div>;
    }

    let finalValue = "";
    if (!ValueObject) {
        finalValue = value || (formik?.values ? fieldValue : "");
        if (finalValue === 0)
            finalValue = "0";
        if (!finalValue)
            finalValue = "";
    }

    return (
        <div
            className={
                "field" +
                __class(className) +
                __class(Dropdown ? dropdownOpen : focused, "focus") +
                __class(disabled, "disabled") +
                __class(noInput, "no-input") +
                __class(((errorText || additionalFieldError) && isFieldTouched), "error") +
                __class(!errorText && finalValue, "valid")
            }
        >
            <label onClick={noInput ? focus : null} ref={refElement}>
                { label &&
                    <div className="label">
                        <span className={__class(required, "required")}>{label}</span>
                    </div>
                }
                <div className="input">
                    { !!Icon &&
                        <div className="icon-wrap">
                            {Icon}
                        </div>
                    }
                    { !noInput ?
                        <div className="inner">
                            <input
                                name={id}
                                type={ password ? "password" : "text" }
                                placeholder={ !ValueObject ? placeholder : "" }
                                onFocus={focus}
                                onChange={changing}
                                onBlur={blur}
                                value={finalValue}
                                onKeyDown={onKeyDown}
                                disabled={!!disabled}
                                maxLength={maxLength}
                                autoComplete={autoComplete ? autoComplete : "off"}
                                {...(readOnly ? {readOnly: "readonly"} : {})}
                            />
                            {ValueObject}
                            { suggestionText &&
                                <div className={"suggestion" + __class(numeric, "solid")}>
                                    <span>{ fieldValue || value }</span>{ suggestionText }
                                </div>
                            }
                        </div> :
                        <div className="inner">
                            { (value || finalValue) ?
                                (ValueObject ? ValueObject : finalValue) :
                                <span className="placeholder">{placeholder}</span>
                            }
                        </div>
                    }
                    { AfterIcon &&
                        <div className="after-icon-wrap">
                            { AfterIcon }
                        </div>
                    }
                    { clearable && !!finalValue &&
                        <div>
                            <div className="clear" onClick={clear} />
                        </div>
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
            { !!Dropdown &&
                <div hidden={!dropdownOpen} ref={refDropdown}>
                    <Dropdown
                        formik={formik}
                        connected={id}
                        setValue={dropdownSetValue}
                        value={fieldValue}
                        options={options}
                        focusIndex={optionIndex}
                        close={() => toggleDropdown(false)}
                    />
                </div>
            }
        </div>
    );
});

export default FieldText;
