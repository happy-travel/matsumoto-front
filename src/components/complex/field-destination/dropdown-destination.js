import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";

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
                { options.map?.((item, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={"line" + __class(focusIndex === index, "focused")}
                            onClick={() => setValue(item)}
                        >
                            <Highlighted str={item.predictionText} highlight={value}/>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
});

export default DestinationDropdown;
