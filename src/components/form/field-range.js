import React from "react";
import { observer } from "mobx-react";

@observer
class FieldRangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var {
        } = this.props;

        return (
            <div class="range-slider">
                <div class="slider"><div><div/></div></div>
                <div class="range-slider-values">
                    <span>USD 0.00</span>
                    <span>USD 1,000.00</span>
                </div>
            </div>
        );
    }
}

export default FieldRangeSlider;
