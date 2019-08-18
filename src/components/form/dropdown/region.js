import React from "react";
import {observer} from "mobx-react";
import UI from "stores/ui-store";
import store from "stores/accommodation-store";

@observer
class RegionDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(city) {
        var fields = {
            "field-residency": "residency",
            "field-nationality": "nationality"
        }, {
            connected,
            formik
        } = this.props;

        formik.setFieldValue(connected, city.names.en); //todo: correct culture select
        store.setSearchRequestField(fields[connected], city.code);
        UI.setCountries([]);
    }

    render() {
        if (UI.countries?.length) //todo: change to separated lists for different inputs
            return (
                <div class="cities dropdown">
                    {UI?.regionList?.map?.(item => (
                        <React.Fragment>
                            {UI.countries?.some?.(city => item.id == city.regionId) && <div class="region">
                                {item.names.en}
                            </div>}
                            {UI.countries?.map?.(city => (
                                item.id == city.regionId ?
                                    <div class="city" onClick={ () => this.setValue(city) }>
                                        {city.names.en}
                                    </div> : null
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            );
        return null;
    }
}

export default RegionDropdown;
