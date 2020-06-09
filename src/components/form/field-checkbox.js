import React from 'react';
import { getValue } from "./utils";

class FieldCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!getValue(this.props.formik, this.props.id)
        };
        this.changing = this.changing.bind(this);
    }

    changing() {
        var { id, formik } = this.props,
            newValue = !this.state.value;

        this.setState({
            value: newValue
        });

        if (formik) {
            formik.setFieldValue(id, newValue);
            formik.setFieldTouched(id, true);
        }
    }

    render() {
        return (
            <div onClick={this.changing} class={"checkbox" + __class(this.state.value, "on")}>
                {this.props.label}
            </div>
        );
    }
}

export default FieldCheckbox;
