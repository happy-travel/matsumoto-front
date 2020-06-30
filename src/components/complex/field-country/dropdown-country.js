import React from "react";
import { observer } from "mobx-react";
import { Flag, Highlighted, decorate } from "simple";

import UI from "stores/ui-store";
import View from "stores/view-store";

@observer
class CountryDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.generateSuggestion = this.generateSuggestion.bind(this);
    }

    generateSuggestion = () => {
        if (!View.countries?.length || !UI.regions?.length)
            return;

        var countries = [...View.countries];

        for (var i = 0; i < countries.length; i++) {
            if (decorate.cutFirstPart(countries[i].name, this.props.value))
                return {...countries[i], value: countries[i].name};
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!View.countries?.length)
            return null;

        const {
            connected,
            formik,
            focusIndex
        } = this.props;

        return (
            <div class="region dropdown">
                <div class="scroll">
                    {View.countries.map((country, index) => {
                        let region = null;
                        if (index === 0 || View.countries[index]?.regionId !== View.countries[index - 1]?.regionId) {
                            const regionId = +View.countries[index]?.regionId;
                            const currentRegion = UI.regions?.find(regionItem => regionItem.id === regionId);
                            region = <div
                                         key={currentRegion?.name}
                                         class="subtitle"
                                     >
                                         {currentRegion?.name?.toUpperCase()}
                                     </div>;
                        }
                        return <div>
                            {region}
                            <div
                              id={`js-value-${index}`}
                              key={`${country.name}-${country.id}`}
                              onClick={ () => this.props.setValue(country, formik, connected) }
                              class={"country line" + __class(focusIndex === index, "focused")}
                            >
                                <Flag code={country.code} />
                                <Highlighted str={country.name} highlight={this.props.value} />
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default CountryDropdown;
