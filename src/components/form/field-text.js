import React from 'react';

const FieldText = class extends React.Component {

    render() {
        var {
            label,
            placeholder,
            Icon,
            Flag,
            clearable,
            addClass
        } = this.props;

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
                            <input type="text" placeholder={ placeholder } />
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
            </div>
        );
    }
};

export default FieldText;
