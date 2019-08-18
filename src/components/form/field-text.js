import React from 'react';

import UI from 'stores/ui-store';
import { observer } from "mobx-react";

@observer
class FieldText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',
            focus: false,
            proxy: {
                currentSuggestion: ''
            }
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.clear = this.clear.bind(this);
        this.changing = this.changing.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onFocus() {
        var newValue = this.props.id;
        if (UI.openDropdown == newValue)
            newValue = null;
        UI.setOpenDropdown(newValue);

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
        //todo: suggestion list
        if (13 == e.keyCode) // Enter
            return; // Select first suggestion or selected menu item
        if (39 == e.keyCode) // Arrow right
            return; // Select first suggestion or selected menu item
        if (38 == e.keyCode) // Arrow top
            return; // Move up in suggestion list
        if (40 == e.keyCode) // Arrow bottom
            return; // Move down in suggestion list
    }

    clear() {
        window.document.getElementById(this.props.id).value = '';
    }

    changing(event) {
        UI.setOpenDropdown(this.props.id);
        this.setState({
            currentValue: event.target.value
        });

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

            formik
        } = this.props;

        return (
            <div class={"field" + (addClass ? ' ' + addClass : '')}>
                <label>
                    { label && <div class="label">
                        <span>{label}</span>
                        {formik && formik.errors && formik.errors[id] && <div id="feedback">{formik.errors.name}</div>}
                    </div> }
                    <div class={"input" + (this.state.focus ? ' focus' : '') + (disabled ? ' disabled' : '')}>
                        { Flag && <div>
                            { Flag }
                        </div> }
                        <div class="inner">
                            <input
                                name={id}
                                type="text"
                                placeholder={ placeholder }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                value={ value || (formik && formik.values && formik.values[id]) || null }
                                onKeyDown={ this.onKeyDown }
                                disabled={ !!disabled }
                            />
                            { this.state.proxy.currentSuggestion && <div class="suggestion">
                                <span>{ this.state.currentValue }</span>{ this.state.proxy.currentSuggestion }
                            </div> }
                        </div>
                        <div class="icon-wrap">
                            { Icon }
                        </div>
                        <div>
                            { clearable && <button class="clear" onClick={ this.clear } /> }
                        </div>
                    </div>
                </label>
                <div class={UI.openDropdown == id ? '' : 'hide'}>
                    { Dropdown }
                </div>
            </div>
        );
    }
}

export default FieldText;
