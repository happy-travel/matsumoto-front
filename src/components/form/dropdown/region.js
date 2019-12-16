import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import store from "stores/accommodation-store";
import { decorate } from "core";
import { Highlighted } from "components/simple";
import { API } from "core";
import Flag from "components/flag";

export const regionInputChanged = (event, props) => {
    store.setSearchRequestField(props.id, '');

    var query = event.target.value;
    if (!query)
        return UI.setCountries([]);

    API.get({
        url: API.COUNTRIES_PREDICTION,
        body: { query },
        after: (data) => {
            UI.setCountries(data || []);
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
        if (!UI.countries?.length || !UI.regionList?.length)
            return;

        var countries = [...UI.countries]; //todo: sort for regions

        for (var i = 0; i < countries.length; i++) {
            if (decorate.cutFirstPart(countries[i].name, this.props.value))
                return countries[i].name;
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!UI.countries?.length)
            return null; //todo: change to separated lists for different inputs

        const {connected, formik} = this.props;
        return (
            <div class="cities dropdown">
                <div class="scroll">
                    {UI.countries.map((country, index) => {
                        let region = null;
                        if (index === 0 || UI.countries[index]?.regionId !== UI.countries[index - 1]?.regionId) {
                            const regionId = +UI.countries[index]?.regionId;
                            const currentRegion = UI.regionList?.find(regionItem => regionItem.id === regionId);
                            region = <div
                              key={currentRegion?.name}
                              class="region">{currentRegion?.name?.toUpperCase()}</div>;
                        }
                        return <div>
                            {region}
                            <div
                              id={`js-value-${index}`}
                              key={`${country.name}-${country.id}`}
                              onClick={ () => this.props.setValue(country, formik, connected) }
                              class={`country line${UI.focusedDropdownIndex === index ? ' country__focused' : ''}`}
                            >
                                <Flag code={country.code} />
                                <Highlighted str={country.name} highlight={this.props.value} /> {/* todo: pick culture normally */}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default RegionDropdown;
