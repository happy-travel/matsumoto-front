import React, { useState, useCallback } from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";
import { decorate } from "simple";
import { windowLocalStorage } from "core/misc/window-storage";
import { $ui, $view } from "stores";

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
    dataDropdown,
    noInput
}) => {
    const [focused, setFocused] = useState(false);
    const [optionIndex, setOptionIndex] = useState(null);
    const [everTouched, setEverTouched] = useState(false);
    const [everChanged, setEverChanged] = useState(false);

    const onFocus = useCallback(() => {
        if (Dropdown) {
            $view.setOpenDropdown(id);
            setOptionIndex(null);
        }
        setFocused(true);
    }, []);

    const blur = useCallback((event) => {
        setFocused(false);
        if (formik)
            formik.handleBlur(event);
        if (!everTouched)
            setEverTouched(true);
    }, []);

    const onKeyDown = (event) => {
        if (!Dropdown || !options?.length) return;

        const scroll = document.querySelectorAll(`#${id} .scroll > div:not(.subtitle)`),
              scrollElem = document.querySelector(`#${id} .scroll`);

        if (!scroll?.length)
            return;

        const suggestion = $ui.suggestions[id]?.suggestionObject;

        switch (event.key) {
            case "Enter":
            case "ArrowRight":
                if (optionIndex !== null || suggestion) {
                    event.preventDefault();
                    setValue(formik, id, optionIndex !== null ? options[optionIndex] : suggestion, false);
                    setFocused(false);
                }
                break;
            case "ArrowUp":
            case "ArrowDown":
                let possible = optionIndex > 0,
                    newIndex = optionIndex - 1,
                    correction = -100;
                if ("ArrowDown" === event.key) {
                    possible = optionIndex === null || options.length > optionIndex + 1;
                    newIndex = optionIndex === null ? 0 : optionIndex + 1;
                    correction = -20;
                }
                if (possible) {
                    setOptionIndex(newIndex);
                    scrollElem.scrollTo(0, scroll[optionIndex]?.offsetTop + correction);
                } else {
                    scrollElem.scrollTo(0, 0);
                }
                setValue(formik, id, options[optionIndex], true);
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
                $view.setOpenDropdown(null);
            if (additionalFieldForValidation)
                formik.setFieldValue(additionalFieldForValidation, false);
        }
        if (onClear)
            onClear();
    },[]);

    const changing = useCallback((event) => {
        if (Dropdown) {
            $view.setOpenDropdown(id);
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

    const errorText = getIn(formik?.errors, id);
    const isFieldTouched = getIn(formik?.touched, id);
    const fieldValue = getIn(formik?.values, id);

    if (suggestion)
        suggestion = decorate.cutFirstPart(suggestion, fieldValue);

    /* todo: Remove this workaround when server rtl suggestions works correct */
    var isSuggestionVisible = windowLocalStorage.get("locale") != "ar";

    if (ValueObject !== undefined) {
        if (ValueObject)
            ValueObject = <div className="value-object">{ValueObject}</div>;
        else
            ValueObject = <div className="value-object placeholder">{placeholder}</div>;
    }

    if (formik && !suggestion)
        suggestion = $ui.getSuggestion(id, fieldValue);

    var finalValue = "";
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
                __class(focused || $view.isDropdownOpen(id), "focus") +
                __class(disabled, "disabled") +
                __class(noInput, "no-input") +
                __class((
                (errorText ||
                (additionalFieldForValidation && getIn(formik?.errors, additionalFieldForValidation))) &&
                isFieldTouched),
                    "error") +
                __class(!errorText && finalValue, "valid")
            }
            data-dropdown={dataDropdown || id}
        >
            <label onClick={noInput ? onFocus : null}>
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
                                onFocus={onFocus}
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
                            { isSuggestionVisible && suggestion &&
                                <div className={"suggestion" + __class(numeric, "solid")}>
                                    <span>{ fieldValue || value }</span>{ suggestion }
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
                { (errorText?.length > 1 && isFieldTouched && !$view.isDropdownOpen(id)) &&
                    <div className={
                        "error-holder" +
                        __class(!everTouched || !everChanged || focused, "possible-hide")
                    }>
                        {errorText}
                    </div>
                }
            </label>
            { !!Dropdown &&
                <div className={__class(!$view.isDropdownOpen(id), "hide")}>
                    <Dropdown
                        formik={formik}
                        connected={id}
                        setValue={
                            (...params) => {
                                if (setValue)
                                    setValue(...params);
                                setFocused(false);
                            }}
                        value={fieldValue}
                        options={options}
                        focusIndex={optionIndex}
                    />
                </div>
            }
        </div>
    );
});

export default FieldText;
