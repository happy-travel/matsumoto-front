import React from 'react';

class FieldSwitch extends React.Component {
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
            id
        } = this.props;
        var {
            value
        } = this.state;

        return (
            <div onClick={this.changing}>
                <div class={"switch-control" + (value ? ' active' : '')} />
                <input type="hidden" id={id} value={value} />
            </div>
        );
    }
}

export default FieldSwitch;
