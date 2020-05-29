import React from "react";
import UI from "stores/ui-store";
import { observer } from "mobx-react";
import { localStorage, decorate, scrollTo } from "core";
import { getValue } from "./utils";

@observer
class FieldText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.clear = this.clear.bind(this);
        this.changing = this.changing.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onFocus() {
        if (this.props.Dropdown) {
            var newOpenDropdown = this.props.id;
            if (UI.openDropdown == newOpenDropdown)
                newOpenDropdown = null;
            UI.setOpenDropdown(newOpenDropdown);
        }

        this.setState({
            focus: true
        });
    }

    onBlur(event) {
        this.setState({
            focus: false
        });

        if (this.props.onBlur)
            this.props.onBlur(event);

        if (this.props.formik)
            this.props.formik.handleBlur(event);
    }

    onKeyDown(e) {
        if (this.props.Dropdown && this.props.options) {
            let value = this.props.options[UI.focusedDropdownIndex];
            let {suggestion} = this.props;
            const {formik, id} = this.props;
            switch (e.keyCode) {
                case 13:
                case 39: // Enter or Right arrow
                    // Select first suggestion or selected menu item
                    if (value && this.props.setValue) {
                        e.preventDefault();
                        this.props.setValue(value, formik, id);
                    }
                    if (!value && this.props.setAutoComplete) {
                        if (formik && !suggestion) {
                            suggestion = UI.getSuggestion(id, getValue(formik, id));
                        }
                        if (suggestion) {
                            e.preventDefault();
                            this.props.setAutoComplete(this.props.formik);
                        }
                    }
                    break;
                case 38: // Arrow top
                    // Move up in suggestion list
                    if (UI.focusedDropdownIndex > 0) {
                        UI.setFocusedDropdownIndex(UI.focusedDropdownIndex - 1);
                        const focusedElement = document.getElementById(`js-value-${UI.focusedDropdownIndex}`);
                        scrollTo(document.querySelector('.dropdown .scroll'), focusedElement?.offsetTop, 250);
                    } else {
                        scrollTo(document.querySelector('.dropdown .scroll'), 0, 250);
                    }
                    value = this.props.options[UI.focusedDropdownIndex];
                    if (this.props.setAutoComplete)
                        this.props.setAutoComplete(this.props.formik, true, value);
                    break;
                case 40: // Arrow bottom
                    // Move down in suggestion list
                    if (UI.focusedDropdownIndex === null || this.props.options.length > UI.focusedDropdownIndex + 1) {
                        UI.setFocusedDropdownIndex(UI.focusedDropdownIndex !== null ? UI.focusedDropdownIndex + 1 : 0);
                        if (UI.focusedDropdownIndex < this.props.options.length - 2) { // disable scroll to last element
                            const focusedElement = document.getElementById(`js-value-${UI.focusedDropdownIndex}`);
                            scrollTo(document.querySelector('.dropdown .scroll'), focusedElement?.offsetTop, 250);
                        }
                    }
                    value = this.props.options[UI.focusedDropdownIndex];
                    if (this.props.setAutoComplete)
                        this.props.setAutoComplete(this.props.formik, true, value);
                    break;
                default:
                    return;
            }
        }
    }

    clear() {
        if (this.props.formik) {
            this.props.formik.setFieldValue(this.props.id, '\n');
            if (this.props.onClear)
                this.props.onClear();
            if (this.props.Dropdown)
                UI.setOpenDropdown(null);
            if (this.props.additionalFieldForValidation) {
                this.props.formik.setFieldValue(this.props.additionalFieldForValidation, false);
            }
        }
    }

    changing(event) {
        if (this.props.Dropdown) {
            UI.setOpenDropdown(this.props.id);
        }
        //todo suggestion

        if (this.props.numeric) {//todo: temporary. rewrite to this.props.mask
            if ("/" == this.props.numeric)
                event.target.value = event.target.value.replace(/[^0-9.\/ ]/g, "");
            else
                event.target.value = event.target.value.replace(/[^0-9.]/g, "");
        }

        if (this.props.onChange)
            this.props.onChange(event, this.props);

        if (this.props.formik)
            this.props.formik.handleChange(event);
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
        var isSuggestionVisible = localStorage.get("direction", true) != "rtl";

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
            <div class={"field" + (addClass ? ' ' + addClass : '')} data-dropdown={this.props["data-dropdown"] || id}>
                <label>
                    { label && <div class="label">
                        <span class={required ? "required" : ""}>{label}</span>
                    </div> }
                    <div class={"input"
                        + (this.state.focus ? ' focus' : '')
                        + (disabled ? ' disabled' : '')
                        + ((formik?.errors[id] && formik?.touched[id]) || (additionalFieldForValidation && formik?.errors[additionalFieldForValidation] &&
                            formik?.touched[id]) ? ' error' : '')
                        + ((!formik?.errors[id] && finalValue) ? ' valid' : '')}
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
                            { isSuggestionVisible && suggestion && <div class={"suggestion" + (numeric ? " solid" : "")}>
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
                    {((formik?.errors[id]?.length > 1) && formik?.touched[id] && (UI.openDropdown != id)) ?
                        <div class="error-holder">{formik.errors[id]}</div>
                    : null}
                </label>
                { Dropdown ? <div class={UI.openDropdown == id ? '' : 'hide'}>
                    <Dropdown formik={formik}
                              connected={id}
                              setValue={setValue}
                              value={getValue(formik, id)}
                              options={options}
                    />
                </div> : null }
            </div>
        );
    }
}

export default FieldText;
