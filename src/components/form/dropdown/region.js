import React from 'react';
import {observer} from "mobx-react";
import CommonStore from 'stores/common-store';
import SearchStore from 'stores/search-store';

@observer
class ResidencyDropdown extends React.Component {

    static setValue(connected, code, value) {
        SearchStore.setRequestNationality(code);
        CommonStore.setCountries([]);
        window.document.getElementById(connected).value = value;
    }

    render() {
        var {
            connected
        } = this.props;

        const store = CommonStore;
        if (store.countries && store.countries.length)
            return (
                <div class="cities dropdown">
                    {store.regionList && store.regionList.map && store.regionList.map(item => (
                        <React.Fragment>
                            {store.countries && store.countries.some && store.countries.some(city => item.id == city.regionId) && <div class="region">
                                {item.names.en}
                            </div>}
                            {store.countries && store.countries.map && store.countries.map(city => (
                                <React.Fragment>
                                    {item.id == city.regionId && <div class="city" onClick={ ResidencyDropdown.setValue.bind(null, connected, city.code, city.names.en) }>
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

export default ResidencyDropdown;
