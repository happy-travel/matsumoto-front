import React from 'react';

import { observer } from "mobx-react";

@observer
class FieldTextarea extends React.Component {
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
    }

    onFocus() {
        this.setState({
            focus: true
        });
    }

    onBlur() {
        this.setState({
            focus: false
        });
    }

    changing() {

    }

    onKeyUp(event) {
        event.target.style.height = "1px";
        event.target.style.height = ( event.target.scrollHeight + 20 )+"px";
    }

    clear() {
        window.document.getElementById(this.props.id).value = '';
    }

    render() {
        var {
            label,
            placeholder,
            clearable,
            addClass,
            id,
            value
        } = this.props;

        return (
            <div class={"field" + (addClass ? ' ' + addClass : '')}>
                <label>
                    { label && <div class="label">
                        <span>{label}</span>
                    </div> }
                    <div class={"input textarea" + (this.state.focus ? ' focus' : '')}>
                        <div class="inner">
                            <textarea
                                id={id}
                                placeholder={ placeholder }
                                value={ value }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                onKeyUp={ this.onKeyUp }
                            />
                            {false && <div class="suggestion">
                                <span>{ this.state.currentValue }</span>{ this.state.proxy.currentSuggestion }
                            </div>}
                        </div>
                        {false && <div>
                            { clearable && <button class="clear" onClick={ this.clear } /> }
                        </div>}
                    </div>
                </label>
            </div>
        );
    }
}

export default FieldTextarea;
