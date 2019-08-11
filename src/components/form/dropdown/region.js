import React from 'react';
import {observer} from "mobx-react";
import CommonStore from 'stores/common-store';
import SearchStore from 'stores/search-store';

@observer
class RegionDropdown extends React.Component {

    setValue(connected, code, value) {
        window.document.getElementById(connected).value = value;

        if ('field-residency' == connected)
            SearchStore.setRequestResidency(code);
        else
            SearchStore.setRequestNationality(code);

        CommonStore.setCountries([]);
    }

    render() {
        var {
            connected
        } = this.props;

        const store = CommonStore;
        if (store.countries && store.countries.length && window.document.getElementById(connected).value) //todo: change to separated lists for different inputs
            return (
                <div class="cities dropdown">
                    {store.regionList && store.regionList.map && store.regionList.map(item => (
                        <React.Fragment>
                            {store.countries && store.countries.some && store.countries.some(city => item.id == city.regionId) && <div class="region">
                                {item.names.en}
                            </div>}
                            {store.countries && store.countries.map && store.countries.map(city => (
                                <React.Fragment>
                                    {item.id == city.regionId && <div class="city" onClick={ this.setValue.bind(null, connected, city.code, city.names.en) }>
                                        {city.names.en}
                                    </div>}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            );
        return null;
    }
}

export default RegionDropdown;
