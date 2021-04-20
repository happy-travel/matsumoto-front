import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DestinationDropdown from "./dropdown-destination";
import { API, session } from "core";
import { decorate } from "simple";

import { $view, $ui, $personal } from "stores";
import {getIn} from "formik";

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

    $view.setDestinations(result);
};

let throttle;

@observer
class FieldDestination extends React.Component {
    setSuggestion = (value) => {
        if ($view?.destinations?.length) {
            const prediction = $view.destinations[0];
            if (!$personal.settings.experimentalFeatures)
                $ui.setSuggestion("destination", value, prediction.value, prediction);
            if ($personal.settings.experimentalFeatures)
                $ui.setSuggestion("destination", value, prediction.predictionText, prediction);
            return;
        }
        $ui.setSuggestion("destination", null);
    };

    inputChanged = (event, formik) => {
        const currentValue = event.target.value.trim();

        this.setSuggestion(currentValue);
        if (!currentValue)
            return $view.setDestinations([]);

        if (formik)
            formik.setFieldValue("htIds", null);

        clearTimeout(throttle);
        throttle = setTimeout(() => {
            API.get({
                url: $personal.settings.experimentalFeatures ? API.LOCATION_PREDICTION : API.EDO_LOCATION_PREDICTION,
                body: {
                    query: currentValue,
                    sessionId: session.google.create()
                },
                after: (data) => {
                    if (currentValue != event.target.value.trim())
                        return;
                    setDestinationSuggestions(data, currentValue);
                    this.setSuggestion(currentValue);

                    const prediction = $ui.suggestions["destination"]?.suggestionObject;
                    if (prediction) {
                        this.setValue(formik, null, prediction, true);
                    }
                }
            });
        }, 200);
    };
    
    setValue = (formik, connected, item, silent) => {
        if (!item)
            return;
        if (!$personal.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", {
                "id": item.id,
                "sessionId": session.google.current(),
                "source": item.source,
                "type": item.type
            });
            formik.setFieldValue("predictionDestination", item.value);
            if (silent !== true) {
                setDestinationSuggestions([]);
                formik.setFieldValue("destination", item.value);
            }
        }
        if ($personal.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", [item.htId]);
            formik.setFieldValue("predictionDestination", item.predictionText);
            if (silent !== true) {
                setDestinationSuggestions([]);
                formik.setFieldValue("destination", item.predictionText);
            }
        }
    };

    render() {
        const {
            formik,
            id,
            label,
            placeholder,
            short
        } = this.props;

        return (
            <FieldText
                formik={formik}
                id={id}
                additionalFieldForValidation="htIds"
                label={label}
                placeholder={placeholder}
                Icon={<span className="icon icon-search-location" />}
                Dropdown={DestinationDropdown}
                options={$view.destinations}
                setValue={this.setValue}
                onChange={this.inputChanged}
                className={short ? "overall" : ""}
            />
        );
    }
}

export default FieldDestination;