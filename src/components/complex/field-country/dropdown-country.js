import React from "react";
import { observer } from "mobx-react";
import { Highlighted, decorate } from "simple";
import { Flag } from "components/simple";
import { $ui, $view } from "stores";

@observer
class CountryDropdown extends React.Component {
    generateSuggestion = () => {
        if (!$view.countries?.length || !$ui.regions?.length)
            return;

        var countries = [...$view.countries];

        for (var i = 0; i < countries.length; i++) {
            if (decorate.cutFirstPart(countries[i].name, this.props.value))
                return {...countries[i], value: countries[i].name};
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value === this.props.value)
            return;

        const suggestion = this.generateSuggestion();
        if (suggestion?.value)
            $ui.setSuggestion(this.props.connected, this.props.value, suggestion.value, suggestion);
        else
            $ui.setSuggestion(this.props.connected, null);
    }

    render() {
        if (!$view.countries?.length)
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
                    {$view.countries.map((country, index) => {
                        let region = null;
                        if (index === 0 || $view.countries[index]?.regionId !== $view.countries[index - 1]?.regionId) {
                            const regionId = +$view.countries[index]?.regionId;
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
                                    onClick={() => setValue(formik, connected, country)}
                                    className={"line" + __class(focusIndex === index, "focused")}
                                >
                                    <Flag code={country.code} />
                                    <Highlighted str={country.name} highlight={this.props.value} />
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CountryDropdown;
