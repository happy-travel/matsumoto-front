import React, { useState } from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DestinationDropdown from "./dropdown-destination";
import { API, session } from "core";
import { decorate } from "simple";
import { $personal } from "stores";

const typesWeights = {
    "landmark": 1,
    "destination": 2,
    "accommodation": 3,
    "location": 4,
};

const sortResults = (newOptions, currentValue) => {
    let result = [];
    if (newOptions) {
        result = newOptions.sort((a, b) => typesWeights[b.type?.toLowerCase()] - typesWeights[a.type?.toLowerCase()]);
        result = [
            ...result.filter(item => decorate.cutFirstPart(item.value, currentValue)),
            ...result.filter(item => !decorate.cutFirstPart(item.value, currentValue))
        ];
    }
    return result;
};

const getIdOfInput = (id) => id + "Input";

const FieldDestination = observer(({
    formik,
    id,
    label,
    placeholder,
    short
}) => {
    const [options, setOptions] = useState([]);
    const [suggestion, setSuggestion] = useState(null);

    const setDestinationSuggestion = (newOptions) => {
        if (newOptions?.length) {
            const prediction = newOptions[0];
            if (!$personal.settings.experimentalFeatures)
                setSuggestion({ text: prediction.value, value: prediction });
            if ($personal.settings.experimentalFeatures)
                setSuggestion({ text: prediction.predictionText, value: prediction });
            return;
        }
        setSuggestion(null);
    };

    const setDestinationPredictionsAndSuggestion = (newOptions) => {
        setOptions(newOptions?.length ? newOptions : null);
        setDestinationSuggestion(newOptions);
    };

    let throttle;
    const inputChanged = (event) => {
        const currentValue = event.target.value.trim();

        if (!currentValue) {
            setDestinationPredictionsAndSuggestion(null);
            return;
        }

        if (formik)
            formik.setFieldValue("htIds", null);

        clearTimeout(throttle);
        throttle = setTimeout(() => {
            API.get({
                url: $personal.settings.experimentalFeatures ?
                        API.LOCATION_PREDICTION :
                        API.EDO_LOCATION_PREDICTION,
                body: {
                    query: currentValue,
                    sessionId: session.google.create()
                },
                after: (data) => {
                    if (currentValue != event.target.value.trim())
                        return;
                    setDestinationPredictionsAndSuggestion(
                        $personal.settings.experimentalFeatures ?
                            data :
                            sortResults(data)
                    );
                }
            });
        }, 200);
    };
    
    const setValue = (item, silent) => {
        if (!item)
            return;
        if (!$personal.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", {
                id: item.id,
                sessionId: session.google.current(),
                source: item.source,
                type: item.type
            });
            formik.setFieldValue(id, item.value);
            if (silent !== true) {
                formik.setFieldValue(getIdOfInput(id), item.value);
            }
        }
        if ($personal.settings.experimentalFeatures) {
            formik.setFieldValue("htIds", [item.htId]);
            formik.setFieldValue(id, item.predictionText);
            if (silent !== true) {
                formik.setFieldValue(getIdOfInput(id), item.predictionText);
            }
        }
        if (silent !== true)
            setDestinationPredictionsAndSuggestion(null);
    };

    const onFocusChanged = (focused, onlyStyles) => {
        if (short) {
            const formElement = document.querySelector(".form.short");
            if (formElement) {
                if (!formElement.style?.width && focused) {
                    formElement.style.width = formElement.offsetWidth + "px";
                    formElement.style.borderColor = "#fff";
                }
                if (formElement.style?.width && !focused) {
                    setTimeout(() => {
                        formElement.style.width = "";
                        formElement.style.borderColor = "";
                    }, 15);
                }
            }
        }
        if (!focused && !onlyStyles) {
            const inputValue = formik.values[getIdOfInput(id)];
            const currentValue = formik.values[id];
            if (inputValue != currentValue && suggestion)
                setValue(suggestion.value);
        }
    };

    return (
        <FieldText
            formik={formik}
            id={getIdOfInput(id)}
            additionalFieldForValidation="htIds"
            label={label}
            placeholder={placeholder}
            Icon={<span className="icon icon-search-location" />}
            Dropdown={DestinationDropdown}
            options={options}
            setValue={setValue}
            onChange={inputChanged}
            className={"capitalize" + __class(short, "overall")}
            noInput={short ? "destination" : false}
            onFocusChanged={onFocusChanged}
            suggestion={suggestion}
        />
    );
});

export default FieldDestination;