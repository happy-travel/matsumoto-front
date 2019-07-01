import React from 'react';
import {observer} from "mobx-react";
import RegionStore from 'stores/region-store';
import SearchStore from 'stores/search-store';

@observer
class ResidencyCustom extends React.Component {

    static setValue(connected, code, value) {
        SearchStore.setRequestNationality(code);
        RegionStore.setCities([]);
        window.document.getElementById(connected).value = value;
    }

    render() {
        var {
            connected
        } = this.props;

        const store = RegionStore;
        if (store.cities && store.cities.length)
            return (
                <div class="cities custom">
                    {store.regionList && store.regionList.map && store.regionList.map(item => (
                        <React.Fragment>
                            {store.cities && store.cities.some && store.cities.some(city => item.id == city.regionId) && <div class="region">
                                {item.names.en} ({item.id})
                            </div>}
                            {store.cities && store.cities.map && store.cities.map(city => (
                                <React.Fragment>
                                    {item.id == city.regionId && <div class="city" onClick={ ResidencyCustom.setValue.bind(null, connected, city.code, city.names.en) }>
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

export default ResidencyCustom;
