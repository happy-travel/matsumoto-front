import React from "react";
import { observer } from "mobx-react";
import { API } from "core";
import { Flag, Highlighted, decorate } from "simple";

import UI from "stores/ui-store";
import View from "stores/view-store";

export const regionInputChanged = (event, props) => {
    if (props.formik)
        props.formik.setFieldValue(`${props.id}Code`, "");

    var query = event.target.value;
    if (!query)
        return View.setCountries([]);

    API.get({
        url: API.COUNTRIES_PREDICTION,
        body: { query },
        after: (data) => {
            View.setCountries(data || []);
        }
    });
};

@observer
class RegionDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.generateSuggestion = this.generateSuggestion.bind(this);
    }

    generateSuggestion = () => {
        if (!View.countries?.length || !UI.regionList?.length)
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
            return null; //todo: change to separated lists for different inputs

        const {connected, formik} = this.props;
        return (
            <div class="cities dropdown">
                <div class="scroll">
                    {View.countries.map((country, index) => {
                        let region = null;
                        if (index === 0 || View.countries[index]?.regionId !== View.countries[index - 1]?.regionId) {
                            const regionId = +View.countries[index]?.regionId;
                            const currentRegion = UI.regionList?.find(regionItem => regionItem.id === regionId);
                            region = <div
                              key={currentRegion?.name}
                              class="subtitle">{currentRegion?.name?.toUpperCase()}</div>;
                        }
                        return <div>
                            {region}
                            <div
                              id={`js-value-${index}`}
                              key={`${country.name}-${country.id}`}
                              onClick={ () => this.props.setValue(country, formik, connected) }
                              class={"country line" + __class(UI.focusedDropdownIndex === index, "country__focused")}
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

export default RegionDropdown;
