import React from "react";
import { observer } from "mobx-react";
import InputRange from "react-input-range";
import { price } from "simple";
import { getValue } from "./utils";

@observer
class FieldRangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: getValue(this.props.formik, this.props.id) || { min: props.min, max: props.max }
        };
        this.changing = this.changing.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    changing(value) {
        this.setState({ value });
        var { formik, id } = this.props;

        if (formik)
            formik.setFieldValue(id, value);
    }

    onChange() {
        if (this.props.onChange)
            this.props.onChange();
    }

    render() {
        var {
            min,
            max,
            currency
        } = this.props;

        return (
            <InputRange
                maxValue={max}
                minValue={min}
                step={1}
                allowSameValues={true}
                formatLabel={(v, label) =>
                    ("max" == label && this.state.value[label] == 2500) ? "Any" : price(currency, this.state.value[label])
                }
                value={this.state.value}
                onChange={this.changing}
                onChangeComplete={this.onChange}
            />
        );
    }
}

export default FieldRangeSlider;
