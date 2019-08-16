import React from 'react';
import {observer} from "mobx-react";
import AccommodationStore from 'stores/accommodation-store';
import CommonStore from 'stores/common-store';

@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
            }
        };
    }

    setValue(connected, item) {
        AccommodationStore.setRequestDestination(item);
        CommonStore.setDestinationSuggestions([]);
        window.document.getElementById(connected).value = item.value;
    }

    render() {
        var {
            connected
        } = this.props;
        const store = CommonStore;

        return (
            <div class="cities dropdown">
                {store.destinations && store.destinations.map && store.destinations.map(item => (
                    <React.Fragment>
                        <div class="city" onClick={ this.setValue.bind(null, connected, item) }>
                            {item.value}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default DestinationDropdown;
