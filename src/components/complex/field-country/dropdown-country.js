import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";
import { Flag } from "components/simple";
import { $ui } from "stores";

const CountryDropdown = observer(({
    connected,
    focusIndex,
    setValue,
    options,
    value
}) => {
    if (!options?.length)
        return null;

    return (
        <div className="dropdown" id={connected}>
            <div className="scroll">
                {options.map((country, index) => {
                    let region = null;
                    if (index === 0 || options[index]?.regionId !== options[index - 1]?.regionId) {
                        const regionId = +options[index]?.regionId;
                        const currentRegion = $ui.regions?.find(regionItem => regionItem.id === regionId);
                        region = (
                            <div
                                 key={currentRegion?.name}
                                 className="subtitle"
                            >
                                {currentRegion?.name?.toUpperCase()}
                            </div>
                        );
                    }
                    return (
                        <React.Fragment key={index}>
                            {region}
                            <div
                                key={`${country.name}-${country.id}`}
                                onClick={() => setValue(country)}
                                className={"line" + __class(focusIndex === index, "focused")}
                            >
                                <Flag code={country.code} />
                                <Highlighted str={country.name} highlight={value} />
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    );
});

export default CountryDropdown;
