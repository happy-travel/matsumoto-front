import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";
import { $personal } from "stores";

const DestinationDropdown = observer(({
    connected,
    focusIndex,
    setValue,
    options,
    value
} ) => {
    if (!options?.length)
        return null;

    return (
        <div className="dropdown" id={connected}>
            <div className="scroll">
                {options.map?.((item, index) => {
                    let destinationType = null;
                    if (!$personal.settings.oldSearchEnabled)
                        destinationType = null;
                    else if (index === 0 || item.type !== options[index - 1]?.type)
                        destinationType = <div className="subtitle">{item.type}</div>;

                    return (
                        <React.Fragment key={index}>
                            {destinationType}
                            <div
                                className={"line" + __class(focusIndex === index, "focused")}
                                onClick={() => setValue(item)}
                            >
                                { $personal.settings.oldSearchEnabled &&
                                    <Highlighted str={item.value} highlight={value}/>
                                }
                                { !$personal.settings.oldSearchEnabled &&
                                    <Highlighted str={item.predictionText} highlight={value}/>
                                }
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    );
});

export default DestinationDropdown;
