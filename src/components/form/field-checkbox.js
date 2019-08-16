import React from 'react';

class FieldCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!this.props.value
        };
        this.changing = this.changing.bind(this);
    }

    changing() {
        this.setState({
            value: !this.state.value
        });
    }

    render() {
        var {
            id,
            label
        } = this.props;
        var {
            value
        } = this.state;

        return (
            <div onClick={this.changing} class={"checkbox" + (value ? ' on' : '')}>
                {label}
                <input type="hidden" id={id} value={value} />
            </div>
        );
    }
}

export default FieldCheckbox;
