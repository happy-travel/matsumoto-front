import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DestinationDropdown from "./dropdown-destination";
import { API, session } from "core";
import { decorate } from "simple";

import View from "stores/view-store";
import UI from "stores/ui-store";
import authStore from "stores/auth-store";

const typesWeights = {
    "landmark": 1,
    "destination": 2,
    "accommodation": 3,
    "location": 4,
};

const setDestinationSuggestions = (value = [], currentValue) => {
    var result = [];
    if (value) {
        result = value.sort((a, b) => typesWeights[b.type?.toLowerCase()] - typesWeights[a.type?.toLowerCase()]);
        result = [
            ...result.filter(item => decorate.cutFirstPart(item.value, currentValue)),
            ...result.filter(item => !decorate.cutFirstPart(item.value, currentValue))
        ];
        result.forEach((item, index) => result[index].value = item.value);
    }

    View.setDestinations(result);
};

@observer
class FieldDestination extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.setDestinationAutoComplete = this.setDestinationAutoComplete.bind(this);
    }

    setSuggestion(value) {
        UI.setSuggestion("destination", value, View?.destinations?.length ? View.destinations[0] : "");
    }

    inputChanged(event, props) {
        var currentValue = event.target.value.trim();
        this.setSuggestion(currentValue);
        if (!currentValue)
            return View.setDestinations([]);

        if (props.formik)
            props.formik.setFieldValue("htIds", null);

        API.get({
            url: authStore.settings.experimentalFeatures ? API.LOCATION_PREDICTION : API.EDO_LOCATION_PREDICTION,
            body: {
                query: currentValue,
                sessionId: session.google.create()
            },
            after: (data) => {
                if (currentValue != event.target.value.trim())
                    return;
                setDestinationSuggestions(data, currentValue);
                UI.setSuggestion("destination", currentValue, View?.destinations?.length ? View.destinations[0] : "");
                this.setDestinationAutoComplete(props.formik, true);
            }
        });
    };
    
    setValue(item, formik, silent) {
        if (!authStore.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", {
                "id": item.id,
                "sessionId": session.google.current(),
                "source": item.source,
                "type": item.type
            });
            formik.setFieldValue("predictionDestination", item.value);
            if (silent !== true) {
                setDestinationSuggestions([]);
                formik.setFieldValue('destination', item.value);
            }
        }
        if (authStore.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", [item.htId]);
            formik.setFieldValue("predictionDestination", item.predictionText);
            if (silent !== true) {
                setDestinationSuggestions([]);
                formik.setFieldValue('destination', item.predictionText);
            }
        }
    }

    setDestinationAutoComplete(formik, silent, suggestion) {
        var item = UI.suggestions.destination;
        if (suggestion)
            item = { value: formik.values.destination, suggestion: suggestion.value, suggestionExtendInfo: suggestion };
        if (item)
            this.setValue(item?.suggestionExtendInfo, formik, silent, item?.value);
    }

    render() {
        const {
            formik,
            id,
            label,
            placeholder,
        } = this.props;

        return (
            <FieldText formik={formik}
                       id={id}
                       additionalFieldForValidation="htIds"
                       label={label}
                       placeholder={placeholder}
                       Icon={<span className="icon icon-hotel" />}
                       Dropdown={DestinationDropdown}
                       options={View.destinations}
                       setValue={this.setValue}
                       onChange={this.inputChanged}
                       setAutoComplete={this.setDestinationAutoComplete}
                       clearable
            />
        );
    }
}

export default FieldDestination;