import React from 'react';

const FieldText = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customVisible: false
        };
        this.toggleCustom = this.toggleCustom.bind(this);
        this.changing = this.changing.bind(this);
    }

    toggleCustom() {
        //todo: remove
        if (this.props.onChange)
            this.props.onChange(null, true);
        //todo: /remove this

        this.setState({
            customVisible: !this.state.customVisible
        })
    }

    changing(e) {
        //todo: remove
        this.setState({
            customVisible: true
        });
        if (this.props.onChange)
            this.props.onChange(e);
        //todo: /remove this
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
            Custom,
            value
        } = this.props;

        var {
            customVisible
        } = this.state;

        return (
            <div class={"field" + (addClass ? ' ' + addClass : '')}>
                <label>
                    { label && <div class="label">
                        <span>{label}</span>
                    </div> }
                    <div class="input">
                        <div>
                            { Flag }
                        </div>
                        <div class="inner">
                            <input
                                id={id}
                                type="text"
                                placeholder={ placeholder }
                                value={ value }
                                onFocus={ this.toggleCustom }
                                onChange={ this.changing }
                            />
                            <div class="suggestion">
                                <span>{' ' || 'Ru' }</span>{' ' || 'ssia' }
                            </div>
                        </div>
                        <div class="icon-wrap">
                            { Icon }
                        </div>
                        <div>
                            { clearable && <button class="clear" /> }
                        </div>
                    </div>
                </label>
                <div class={customVisible ? '' : 'hide'}>
                    { Custom }
                </div>
            </div>
        );
    }
};

export default FieldText;
