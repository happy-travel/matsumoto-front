import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import store from "stores/accommodation-store";
import { decorate } from "core";
import { Highlighted } from "components/simple";

const anotherField = {
    "residency": "nationality",
    "nationality": "residency"
};

/* Refactoring possibility: remove region sorter from render() */
@observer
class RegionDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.generateSuggestion = this.generateSuggestion.bind(this);
    }

    setValue(city) {
        var {
            connected,
            formik
        } = this.props;

        formik.setFieldValue(connected, city.names.en); //todo: correct culture select
        store.setSearchRequestField(connected, city.code);
        UI.setCountries([]);

        if (!store.search.request[anotherField[connected]]) {
            store.setSearchRequestField(anotherField[connected], city.code);
            formik.setFieldValue(anotherField[connected], city.names.en);
        }
    }

    generateSuggestion = () => {
        if (!UI.countries?.length || !UI.regionList?.length)
            return;

        var countries = [...UI.countries]; //todo: sort for regions

        for (var i = 0; i < countries.length; i++) {
            if (decorate.cutFirstPart(countries[i].names.en, this.props.value))
                return countries[i].names.en;
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!UI.countries?.length)
            return null; //todo: change to separated lists for different inputs

        return (
            <div class="cities dropdown">
                <div class="scroll">
                    {UI.regionList?.map?.(item => (
                        <React.Fragment>
                            {UI.countries?.some?.(city => item.id == city.regionId) && <div class="region">
                                {item.names.en} {/* todo: pick culture normally */}
                            </div>}
                            {UI.countries?.map?.(city => (
                                item.id == city.regionId ?
                                    <div class="city line" onClick={ () => this.setValue(city) }>
                                        <Highlighted str={city.names.en} highlight={this.props.value} /> {/* todo: pick culture normally */}
                                    </div> : null
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
}

export default RegionDropdown;
