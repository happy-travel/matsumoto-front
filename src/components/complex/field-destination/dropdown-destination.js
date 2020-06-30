import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";

import View from "stores/view-store";

@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        var {
            connected,
            formik
        } = this.props;

        View.setDestinations([]);
        formik.setFieldValue(connected, item.value);
    }

    render() {
        if (!View?.destinations?.length)
            return null;

        const {
            connected,
            formik,
            focusIndex
        } = this.props;

        return (
            <div class="region dropdown">
                <div class="scroll">
                    {View?.destinations?.map?.((item, index) => {
                        let destinationType = null;
                        if (index === 0 || item.type !== View.destinations[index - 1]?.type)
                            destinationType = <div className="subtitle">{item.type}</div>;

                        return (
                            <React.Fragment>
                                {destinationType}
                                <div id={`js-value-${index}`}
                                     class={"country line" + __class(focusIndex === index, "focused")}
                                     onClick={() => this.props.setValue(item, formik, connected)}>
                                    <Highlighted str={item.value} highlight={this.props.value} />
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default DestinationDropdown;
