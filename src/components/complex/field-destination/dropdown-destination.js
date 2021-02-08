import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";
import authStore from "stores/auth-store";

import View from "stores/view-store";

@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
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
                        if (authStore.settings.newPredictions)
                            destinationType = null;

                        return (
                            <React.Fragment>
                                {destinationType}
                                <div id={`js-value-${index}`}
                                     class={"country line" + __class(focusIndex === index, "focused")}
                                     onClick={() => this.props.setValue(item, formik, connected)}>
                                    {!authStore.settings.newPredictions &&
                                        <Highlighted str={item.value} highlight={this.props.value}/>
                                    }
                                    {authStore.settings.newPredictions &&
                                        <Highlighted str={item.predictionText} highlight={this.props.value}/>
                                    }
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
