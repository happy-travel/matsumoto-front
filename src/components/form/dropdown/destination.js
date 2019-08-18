import React from 'react';
import {observer} from "mobx-react";
import store from 'stores/accommodation-store';
import UI from 'stores/ui-store';

@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        var {
            connected,
            formik
        } = this.props;

        store.setRequestDestination(item);
        UI.setDestinationSuggestions([]);
        formik.setFieldValue(connected, item.value);
    }

    render() {
        return (
            <div class="cities dropdown">
                {UI?.destinations?.map?.(item => (
                    <React.Fragment>
                        <div class="city" onClick={ () => this.setValue(item) }>
                            {item.value}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default DestinationDropdown;
