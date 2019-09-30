import React from "react";
import { observer } from "mobx-react";
import InputRange from 'react-input-range';

const labels = (label, values, currency) => {
    return currency + " " + (values[label] || 0) + ".00";
};

@observer
class FieldRangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { min: 0, max: 20 }
        };
    }

    render() {
        return (
            <InputRange
                maxValue={20}
                minValue={0}
                allowSameValues={true}
                formatLabel={(v, label) => labels(
                    label,
                    this.state.value,
                    "USD" //todo: currency binding
                )}
                value={this.state.value}
                onChange={value => this.setState({ value })}
            />
        );
    }
}

export default FieldRangeSlider;
