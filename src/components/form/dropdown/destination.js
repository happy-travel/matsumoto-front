import React from 'react';
import {observer} from "mobx-react";
import store from 'stores/accommodation-store';
import UI from 'stores/ui-store';
import { decorate } from "core";
import { Highlighted } from "components/simple";

/* Refactoring possibility: make a class for suggestion dropdown menus and remove code copies with region dropdown */
@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.generateSuggestion = this.generateSuggestion.bind(this);
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

    generateSuggestion = () => {
        if (!UI?.destinations?.length)
            return;

        for (var i = 0; i < UI.destinations.length; i++) {
            if (decorate.cutFirstPart(UI.destinations[i].value, this.props.value))
                return UI.destinations[i].value;
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!UI?.destinations?.length)
            return null;

        const {connected, formik} = this.props;
        return (
        <div class="cities dropdown">
            <div class="scroll">
                {UI?.destinations?.map?.((item, index) => (
                    <React.Fragment>
                        <div class={`country line${UI.focusedDropdownIndex === index ? ' country__focused' : ''}`} onClick={ () => this.props.setValue(item, formik, connected) }>
                            <Highlighted str={item.value} highlight={this.props.value} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
        );
    }
}

export default DestinationDropdown;
