import React from 'react';

import CommonStore from 'stores/common-store';
import { observer } from "mobx-react";

@observer
class FieldText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',
            focus: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.clear = this.clear.bind(this);
        this.changing = this.changing.bind(this);
    }

    onFocus() {
        var newValue = this.props.id;
        if (CommonStore.openDropdown == newValue)
            newValue = null;
        CommonStore.setOpenDropdown(newValue);

        this.setState({
            focus: true
        });
    }

    onBlur() {
        this.setState({
            focus: false
        });
    }

    clear() {
        window.document.getElementById(this.props.id).value = '';
    }

    changing(event) {
        this.setState({
            currentValue: event.target.value
        });

        //todo suggestion

        if (this.props.onChange)
            this.props.onChange(event);
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
            value
        } = this.props;

        return (
            <div class={"field" + (addClass ? ' ' + addClass : '')}>
                <label>
                    { label && <div class="label">
                        <span>{label}</span>
                    </div> }
                    <div class={"input" + (this.state.focus ? ' focus' : '')}>
                        <div>
                            { Flag }
                        </div>
                        <div class="inner">
                            <input
                                id={id}
                                type="text"
                                placeholder={ placeholder }
                                value={ value }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                            />
                            <div class="suggestion">
                                <span>{ this.state.currentValue }</span>{ CommonStore.currentSuggestion }
                            </div>
                        </div>
                        <div class="icon-wrap">
                            { Icon }
                        </div>
                        <div>
                            { clearable && <button class="clear" onClick={ this.clear } /> }
                        </div>
                    </div>
                </label>
                <div class={CommonStore.openDropdown == id ? '' : 'hide'}>
                    { Dropdown }
                </div>
            </div>
        );
    }
}

export default FieldText;
