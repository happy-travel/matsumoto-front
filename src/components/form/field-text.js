import React from "react";
import UI from "stores/ui-store";
import { observer } from "mobx-react";
import { localStorage } from "core";

const getValue = (formik, id) => {
    if (!formik) return '';
    return id.split('.').reduce((o,i)=>o?.[i], formik.values);
};

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
        if (this.props.formik)
            this.props.formik.handleBlur(event);
    }

    onKeyDown(e) {
        if (this.props.Dropdown) {
            if (13 == e.keyCode || 39 == e.keyCode) // Enter or Right arrow
                return; // Select first suggestion or selected menu item
            if (38 == e.keyCode) // Arrow top
                return; // Move up in suggestion list
            if (40 == e.keyCode) // Arrow bottom
                return; // Move down in suggestion list
        }
    }

    clear() {
        if (this.props.formik) {
            this.props.formik.setFieldValue(this.props.id, '\n');
            if (this.props.Dropdown)
                UI.setOpenDropdown(null);
        }
    }

    changing(event) {
        if (this.props.Dropdown) {
            UI.setOpenDropdown(this.props.id);
        }
        //todo suggestion

        if (this.props.onChange)
            this.props.onChange(event);

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
            addClass,
            id,
            Dropdown,
            value,
            disabled,
            required,
            readonly,
            options,
            ValueObject,

            formik
        } = this.props,
            suggestion = null;

        /* todo: Remove this workaround when server rtl suggestions works correct */
        var isSuggestionVisible = localStorage.get("direction", true) != "rtl";

        if (ValueObject !== undefined) {
            if (ValueObject)
                ValueObject = <div class="value-object">{ValueObject}</div>;
            else
                ValueObject = <div class="value-object placeholder">{placeholder}</div>;
        }

        if (formik)
            suggestion = UI.getSuggestion(id, getValue(formik, id));

        return (
            <div class={"field" + (addClass ? ' ' + addClass : '')}>
                <label>
                    { label && <div class="label">
                        <span class={required ? "required" : ""}>{label}</span>
                    </div> }
                    <div class={"input" + (this.state.focus ? ' focus' : '') + (disabled ? ' disabled' : '') + ((formik?.errors[id] && formik?.touched[id]) ? ' error' : '')}>
                        { Flag && <div>
                            { Flag }
                        </div> }
                        <div class="inner">
                            <input
                                name={id}
                                type="text"
                                placeholder={ !ValueObject && placeholder }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                value={ ValueObject ? '' : (value || (formik?.values ? getValue(formik, id) : '') || '') }
                                onKeyDown={ this.onKeyDown }
                                disabled={ !!disabled }
                                autocomplete="off"
                                {...(readonly ? {readonly: "readonly"} : {})}
                            />
                            { ValueObject }
                            { isSuggestionVisible && suggestion && <div class="suggestion">
                                <span>{ getValue(formik, id) }</span>{ suggestion }
                            </div> }
                        </div>
                        { Icon && <div class="icon-wrap">
                            { Icon }
                        </div> }
                        { (clearable && getValue(formik, id)) ? <div>
                            <button type="button" class="clear" onClick={ this.clear } />
                        </div> : null }
                    </div>
                    {((formik?.errors[id]?.length > 1) && formik?.touched[id] && (UI.openDropdown != id)) ?
                        <div class="error-holder">{formik.errors[id]}</div>
                    : null}
                </label>
                { Dropdown ? <div class={UI.openDropdown == id ? '' : 'hide'}>
                    <Dropdown formik={formik}
                              connected={id}
                              value={getValue(formik, id)}
                              options={options}
                    />
                </div> : null }
            </div>
        );
    }
}

export default FieldText;
