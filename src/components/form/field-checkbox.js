import React from "react";
import { getIn } from "formik";

class FieldCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!getIn(this.props.formik?.values, this.props.id)
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

        if (this.props.onChange)
            this.props.onChange();
    }

    render() {
        return (
            <div onClick={this.changing} className={"checkbox" + __class(this.state.value, "on")}>
                {this.props.label}
            </div>
        );
    }
}

export default FieldCheckbox;
