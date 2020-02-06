import React from 'react';
import {observer} from "mobx-react";
import store from 'stores/accommodation-store';
import UI from 'stores/ui-store';
import View from 'stores/view-store';
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
        View.setDestinationSuggestions([]);
        formik.setFieldValue(connected, item.value);
    }

    generateSuggestion = () => {
        if (!View?.destinations?.length)
            return;

        for (var i = 0; i < View.destinations.length; i++) {
            if (decorate.cutFirstPart(View.destinations[i].value, this.props.value))
                return View.destinations[i];
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!View?.destinations?.length)
            return null;

        const {connected, formik} = this.props;
        return (
        <div class="cities dropdown">
            <div class="scroll">
                {View?.destinations?.map?.((item, index) => {
                    let destinationType = null;
                    if (index === 0 || item.type !== View.destinations[index - 1]?.type) {
                        destinationType = <div className="subtitle">{item.type}</div>
                    }
                    return (
                        <React.Fragment>
                            {destinationType}
                            <div className={`country line${UI.focusedDropdownIndex === index ? ' country__focused' : ''}`} onClick={ () => this.props.setValue(item, formik, connected) }>
                                <Highlighted str={item.value} highlight={this.props.value} />
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
        );
    }
}

export default DestinationDropdown;
