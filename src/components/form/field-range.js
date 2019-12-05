import React from "react";
import { observer } from "mobx-react";
import InputRange from "react-input-range";
import { price } from "core";

@observer
class FieldRangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { min: props.min, max: props.max }
        };
        this.changing = this.changing.bind(this);
    }

    changing(value) {
        this.setState({ value });
        var { formik, id } = this.props;

        if (formik)
            formik.setFieldValue(id, value);
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
                formatLabel={(v, label) => price(currency, this.state.value[label])}
                value={this.state.value}
                onChange={this.changing}
            />
        );
    }
}

export default FieldRangeSlider;
