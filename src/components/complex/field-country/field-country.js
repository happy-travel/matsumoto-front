import React, { useState } from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import CountryDropdown from "./dropdown-country";
import { Flag } from "components/simple";
import { API } from "core";
import { $ui } from "stores";

const getCodeFieldId = (field) => field + "Code";

const FieldCountry = observer(({
    formik,
    id,
    label,
    placeholder,
    anotherField,
    className,
    clearable,
    required,
    forceAnotherField
} ) => {
    const [options, setOptions] = useState([]);
    const [suggestion, setSuggestion] = useState(null);

    const setCountryPredictions = (newOptions) => {
        let countries = [];
        if (newOptions) {
            const newGroupedCountries = newOptions.reduce(
                (r, a) => {
                    r[a.regionId] = r[a.regionId] || [];
                    r[a.regionId].push(a);
                    return r;
                },
                Object.create(null)
            );
            $ui.regions?.forEach(region => {
                if (newGroupedCountries[region.id]) {
                    countries = countries.concat(newGroupedCountries[region.id].sort((a, b) => {
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    }));
                }
            });
        }
        setOptions(countries);
    };

    const setCountrySuggestion = (newOptions, value) => {
        if (newOptions?.length) {
            const prediction = newOptions.find(item => item.name.toLowerCase().indexOf(value.toLowerCase()) == 0);
            if (prediction) {
                setSuggestion({text: prediction.name, value: prediction});
                return;
            }
        }
        setSuggestion(null);
    };

    const setCountryPredictionsAndSuggestion = (newOptions, value) => {
        setCountryPredictions(newOptions);
        setCountrySuggestion(newOptions, value);
    };

    let throttle;
    const inputChanged = (event) => {
        const currentValue = event.target.value.trim();

        formik.setFieldValue(getCodeFieldId(id), "");

        if (!currentValue) {
            setCountryPredictionsAndSuggestion(null);
            return;
        }

        clearTimeout(throttle);
        throttle = setTimeout(() => {
            API.get({
                url: API.COUNTRIES_PREDICTION,
                body: { query: currentValue },
                after: (data) => setCountryPredictionsAndSuggestion(data, event.target.value.trim())
            });
        }, 200);
    };
    
    const setValue = (country, silent) => {
        if (silent)
            return;
        setTimeout(() => {
            setCountryPredictionsAndSuggestion(null);
        }, 0);
        formik.setFieldValue(id, country.name);
        formik.setFieldValue(getCodeFieldId(id), country.code);
        if (anotherField)
            if (forceAnotherField || !formik.values[getCodeFieldId(anotherField)]) {
                formik.setFieldValue(anotherField, country.name);
                formik.setFieldValue(getCodeFieldId(anotherField), country.code);
            }
    };

    return (
        <FieldText
            formik={formik}
            id={id}
            additionalFieldForValidation={getCodeFieldId(id)}
            label={label}
            placeholder={placeholder}
            Icon={
                formik.values[getCodeFieldId(id)] ?
                    <Flag code={formik.values[getCodeFieldId(id)]} /> :
                    null
            }
            Dropdown={CountryDropdown}
            onChange={inputChanged}
            options={options}
            setValue={setValue}
            className={"capitalize" + __class(className)}
            clearable={clearable}
            required={required}
            suggestion={suggestion}
        />
    );
});

export default FieldCountry;
