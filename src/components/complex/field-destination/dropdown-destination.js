import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";
import { $personal, $view } from "stores";

@observer
class DestinationDropdown extends React.Component {
    render() {
        if (!$view?.destinations?.length)
            return null;

        const {
            connected,
            formik,
            focusIndex,
            setValue
        } = this.props;

        return (
            <div className="dropdown" id={connected}>
                <div className="scroll">
                    {$view?.destinations?.map?.((item, index) => {
                        let destinationType = null;
                        if (index === 0 || item.type !== $view.destinations[index - 1]?.type)
                            destinationType = <div className="subtitle">{item.type}</div>;
                        if ($personal.settings.experimentalFeatures)
                            destinationType = null;

                        return (
                            <React.Fragment key={index}>
                                {destinationType}
                                <div
                                    className={"line" + __class(focusIndex === index, "focused")}
                                    onClick={() => setValue(formik, false, item)}
                                >
                                    { !$personal.settings.experimentalFeatures &&
                                        <Highlighted str={item.value} highlight={this.props.value}/>
                                    }
                                    { $personal.settings.experimentalFeatures &&
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
