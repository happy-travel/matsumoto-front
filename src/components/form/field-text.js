import React from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";
import { scrollTo } from "core";
import { decorate } from "simple";
import { windowLocalStorage } from "core/misc/window-storage";

import UI from "stores/ui-store";
import View from "stores/view-store";

@observer
class FieldText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            ddFocusIndex: null,
            everBlured: false,
            everChanged: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.clear = this.clear.bind(this);
        this.changing = this.changing.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onFocus() {
        const { id, Dropdown } = this.props;
        if (Dropdown) {
            var newOpenDropdown = id;
            if (View.isDropdownOpen(newOpenDropdown))
                newOpenDropdown = null;
            View.setOpenDropdown(newOpenDropdown);
            this.setState({ ddFocusIndex: null });
        }

        this.setState({
            focus: true
        });
    }

    onBlur(event) {
        const { formik, onBlur } = this.props;
        this.setState({ focus: false });
        if (onBlur)
            onBlur(event);
        if (formik)
            formik.handleBlur(event);
        if (!this.state.everBlured)
            this.setState({ everBlured: true });
    }

    onKeyDown(e) {
        var { formik, Dropdown, id, options, suggestion, setValue, setAutoComplete } = this.props;
        if ( !Dropdown || !options ) return;

        let value = options[this.state.ddFocusIndex];
        switch (e.keyCode) {
            case 13:
            case 39: // Enter or Right arrow
                // Select first suggestion or selected menu item
                if (value && setValue) {
                    e.preventDefault();
                    setValue(value, formik, id);
                }
                if (!value && setAutoComplete) {
                    if (formik && !suggestion) {
                        suggestion = UI.getSuggestion(id, getIn(formik, id));
                    }
                    if (suggestion) {
                        e.preventDefault();
                        setAutoComplete(formik);
                    }
                }
                break;
            case 38: // Arrow top
                // Move up in suggestion list
                if (this.state.ddFocusIndex > 0) {
                    this.setState({ ddFocusIndex: this.state.ddFocusIndex - 1 });
                    const focusedElement = document.getElementById(`js-value-${this.state.ddFocusIndex}`);
                    scrollTo(document.querySelector('.dropdown .scroll'), focusedElement?.offsetTop, 250);
                } else {
                    scrollTo(document.querySelector('.dropdown .scroll'), 0, 250);
                }
                value = options[this.state.ddFocusIndex];
                if (setAutoComplete)
                    setAutoComplete(formik, true, value);
                break;
            case 40: // Arrow bottom
                // Move down in suggestion list
                if (this.state.ddFocusIndex === null || options.length > this.state.ddFocusIndex + 1) {
                    this.setState({ddFocusIndex: this.state.ddFocusIndex !== null ? this.state.ddFocusIndex + 1 : 0 });
                    if (this.state.ddFocusIndex < options.length - 2) { // disable scroll to last element
                        const focusedElement = document.getElementById(`js-value-${this.state.ddFocusIndex}`);
                        scrollTo(document.querySelector('.dropdown .scroll'), focusedElement?.offsetTop, 250);
                    }
                }
                value = options[this.state.ddFocusIndex];
                if (setAutoComplete)
                    setAutoComplete(formik, true, value);
                break;
            default:
                return;
        }
    }

    clear() {
        const { formik, id, onClear, Dropdown, additionalFieldForValidation } = this.props;
        if (formik) {
            formik.setFieldValue(id, "");
            formik.setFieldTouched(id, false);
            if (Dropdown)
                View.setOpenDropdown(null);
            if (additionalFieldForValidation)
                formik.setFieldValue(additionalFieldForValidation, false);
        }
        if (onClear)
            onClear();
    }

    changing(event) {
        const { Dropdown, id, numeric, onChange, formik } = this.props;
        if (Dropdown) {
            View.setOpenDropdown(id);
            this.setState({ ddFocusIndex: null });
        }
        if (numeric)
            if ("/" == numeric)
                event.target.value = event.target.value.replace(/[^0-9.\/ ]/g, "");
            else
                event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        if (onChange)
            onChange(event, this.props);
        if (formik) {
            formik.setFieldTouched(id, true);
            formik.handleChange(event);
        }
        if (!this.state.everChanged)
            this.setState({ everChanged: true });
    }

    render() {
        var {
            label,
            placeholder,
            Icon,
            Flag,
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
            //onChange
        } = this.props;
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
            suggestion = UI.getSuggestion(id, fieldValue);

        var finalValue = "";
        if (!ValueObject) {
            finalValue = value || (formik?.values ? fieldValue : "");
            if (finalValue === 0)
                finalValue = "0";
            if (!finalValue)
                finalValue = "";
        }

        return (
            <div className={"field" + __class(className)} data-dropdown={this.props["data-dropdown"] || id}>
                <label>
                    { label && <div className={"label" +__class(this.state.focus, "focus")}>
                        <span className={__class(required, "required")}>{label}</span>
                    </div> }
                    <div className={"input" +
                        __class(this.state.focus, "focus") +
                        __class(disabled, "disabled") +
                        __class(((errorText || (additionalFieldForValidation && getIn(formik?.errors, additionalFieldForValidation))) && isFieldTouched),
                                          "error") +
                        __class(!errorText && finalValue, "valid")}
                    >
                        { !!Flag && <div>
                            { Flag }
                        </div> }
                        <div className="inner">
                            <input
                                name={id}
                                type={ password ? "password" : "text" }
                                placeholder={ !ValueObject ? placeholder : "" }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                value={ finalValue }
                                onKeyDown={ this.onKeyDown }
                                disabled={ !!disabled }
                                maxLength={ maxLength }
                                autoComplete={autoComplete ? autoComplete : "off"}
                                {...(readOnly ? {readOnly: "readonly"} : {})}
                            />
                            { ValueObject }
                            { isSuggestionVisible && suggestion && <div className={"suggestion" + __class(numeric, "solid")}>
                                <span>{ fieldValue || value }</span>{ suggestion }
                            </div> }
                        </div>
                        { Icon && <div className="icon-wrap">
                            { Icon }
                        </div> }
                        { (clearable && finalValue) ? <div>
                            <div className="clear" onClick={ this.clear } />
                        </div> : null }
                    </div>
                    {(errorText?.length > 1 && isFieldTouched && (!View.isDropdownOpen(id))) ?
                        <div className={"error-holder" +
                                    __class(!this.state.everBlured || !this.state.everChanged || this.state.focus, "possible-hide") //possible-hide
                        }>{errorText}</div>
                    : null}
                </label>
                { Dropdown ? <div className={__class(!View.isDropdownOpen(id), "hide")}>
                    <Dropdown formik={formik}
                              connected={id}
                              setValue={setValue}
                              value={fieldValue}
                              options={options}
                              focusIndex={this.state.ddFocusIndex}
                    />
                </div> : null }
            </div>
        );
    }
}

export default FieldText;
