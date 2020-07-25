import React from "react";
import { observer } from "mobx-react";
import { scrollTo } from "core";
import { decorate } from "simple";
import { getValue } from "./utils";
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
                        suggestion = UI.getSuggestion(id, getValue(formik, id));
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
            if (onClear)
                onClear();
            if (Dropdown)
                View.setOpenDropdown(null);
            if (additionalFieldForValidation)
                formik.setFieldValue(additionalFieldForValidation, false);
        }
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
            addClass,
            id,
            Dropdown,
            value,
            disabled,
            required,
            readonly,
            options,
            ValueObject,
            maxLength,
            numeric,
            suggestion,
            formik,
            setValue,
            additionalFieldForValidation,
            autocomplete,
            //onChange
        } = this.props;

        if (suggestion)
            suggestion = decorate.cutFirstPart(suggestion, getValue(formik, id));

        /* todo: Remove this workaround when server rtl suggestions works correct */
        var isSuggestionVisible = windowLocalStorage.get("locale") != "ar";

        if (ValueObject !== undefined) {
            if (ValueObject)
                ValueObject = <div class="value-object">{ValueObject}</div>;
            else
                ValueObject = <div class="value-object placeholder">{placeholder}</div>;
        }

        if (formik && !suggestion)
            suggestion = UI.getSuggestion(id, getValue(formik, id));

        var finalValue = ValueObject ? '' : (value || (formik?.values ? getValue(formik, id) : '') || '');

        return (
            <div class={"field" + __class(addClass)} data-dropdown={this.props["data-dropdown"] || id}>
                <label>
                    { label && <div class="label">
                        <span class={__class(required, "required")}>{label}</span>
                    </div> }
                    <div class={"input" +
                        __class(this.state.focus, "focus") +
                        __class(disabled, "disabled") +
                        __class(((formik?.errors[id] || (additionalFieldForValidation && formik?.errors[additionalFieldForValidation])) && formik?.touched[id]),
                                          "error") +
                        __class(!formik?.errors[id] && finalValue, "valid")}
                    >
                        { !!Flag && !!finalValue && <div>
                            { Flag }
                        </div> }
                        <div class="inner">
                            <input
                                name={id}
                                type={ password ? "password" : "text" }
                                placeholder={ !ValueObject && placeholder }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                value={ finalValue }
                                onKeyDown={ this.onKeyDown }
                                disabled={ !!disabled }
                                maxLength={ maxLength }
                                autocomplete={autocomplete ? autocomplete : "off"}
                                {...(readonly ? {readonly: "readonly"} : {})}
                            />
                            { ValueObject }
                            { isSuggestionVisible && suggestion && <div class={"suggestion" + __class(numeric, "solid")}>
                                <span>{ getValue(formik, id) || value }</span>{ suggestion }
                            </div> }
                        </div>
                        { Icon && <div class="icon-wrap">
                            { Icon }
                        </div> }
                        { (clearable && getValue(formik, id)) ? <div>
                            <div class="clear" onClick={ this.clear } />
                        </div> : null }
                    </div>
                    {((formik?.errors[id]?.length > 1) && formik?.touched[id] && (!View.isDropdownOpen(id))) ?
                        <div class={"error-holder" +
                                    __class(!this.state.everBlured || !this.state.everChanged || this.state.focus, "possible-hide") //possible-hide
                        }>{formik.errors[id]}</div>
                    : null}
                </label>
                { Dropdown ? <div class={__class(!View.isDropdownOpen(id), "hide")}>
                    <Dropdown formik={formik}
                              connected={id}
                              setValue={setValue}
                              value={getValue(formik, id)}
                              options={options}
                              focusIndex={this.state.ddFocusIndex}
                    />
                </div> : null }
            </div>
        );
    }
}

export default FieldText;
