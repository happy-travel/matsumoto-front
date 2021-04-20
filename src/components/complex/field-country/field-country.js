import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import CountryDropdown from "./dropdown-country";
import { Flag } from "components/simple";
import { API } from "core";
import { $view, $ui } from "stores";

const codeField = field => field + "Code";

const setCountrySuggestions = value => {
    const newGroupedCountries = value.reduce(function (r, a) {
        r[a.regionId] = r[a.regionId] || [];
        r[a.regionId].push(a);
        return r;
    }, Object.create(null));
    let countries = [];
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
    $view.setCountries(countries);
};

const FieldCountry = observer(({
    formik,
    id,
    label,
    placeholder,
    anotherField,
    className,
    clearable,
    required
} ) => {
    let throttle;
    const inputChanged = (event, formik, id) => {
        formik.setFieldValue(codeField(id), "");

        var query = event.target.value;
        if (!query)
            return setCountrySuggestions([]);

        clearTimeout(throttle);
        throttle = setTimeout(() => {
            API.get({
                url: API.COUNTRIES_PREDICTION,
                body: { query },
                after: data => {
                    setCountrySuggestions(data || []);
                }
            });
        }, 200);
    };
    
    const setValue = (formik, connected, country, silent) => {
        if (silent)
            return;

        setCountrySuggestions([]);

        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(codeField(connected), country.code);
        if (anotherField)
            if (!formik.values[codeField(anotherField)]) {
                formik.setFieldValue(anotherField, country.name);
                formik.setFieldValue(codeField(anotherField), country.code);
            }
    };

    return (
        <FieldText
            formik={formik}
            id={id}
            additionalFieldForValidation={codeField(id)}
            label={label}
            placeholder={placeholder}
            Icon={formik.values[codeField(id)] ? <Flag code={formik.values[codeField(id)]} /> : null}
            Dropdown={CountryDropdown}
            onChange={inputChanged}
            options={$view.countries}
            setValue={setValue}
            onClear={() => formik.setFieldValue(codeField(id), "")}
            className={className}
            clearable={clearable}
            required={required}
        />
    );
});

export default FieldCountry;
