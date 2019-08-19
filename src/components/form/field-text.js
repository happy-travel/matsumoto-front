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
        if (13 == e.keyCode || 39 == e.keyCode) // Enter or Right arrow
            return; // Select first suggestion or selected menu item
        if (38 == e.keyCode) // Arrow top
            return; // Move up in suggestion list
        if (40 == e.keyCode) // Arrow bottom
            return; // Move down in suggestion list
    }

    clear() {
        if (this.props.formik)
            this.props.formik.setFieldValue(this.props.id, '\n');
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
        } = this.props,
            suggestion = null;

        if (formik)
            suggestion = UI.getSuggestion(id, formik.values[id]);

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
                            { suggestion && <div class="suggestion">
                                <span>{ formik.values[id] }</span>{ suggestion }
                            </div> }
                        </div>
                        <div class="icon-wrap">
                            { Icon }
                        </div>
                        <div>
                            { clearable && <button type="button" class="clear" onClick={ this.clear } /> }
                        </div>
                    </div>
                </label>
                { Dropdown ? <div class={UI.openDropdown == id ? '' : 'hide'}>
                    <Dropdown formik={formik}
                              connected={id}
                              value={formik.values[id]}
                    />
                </div> : null }
            </div>
        );
    }
}

export default FieldText;
