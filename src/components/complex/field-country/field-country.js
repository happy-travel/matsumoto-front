import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import CountryDropdown from "./dropdown-country";
import { Flag } from "simple";
import { API } from "core";

import View from "stores/view-store";
import UI from "stores/ui-store";


const codeField = field => field+"Code";

const setCountrySuggestions = value => {
    const newGroupedCountries = value.reduce(function (r, a) {
        r[a.regionId] = r[a.regionId] || [];
        r[a.regionId].push(a);
        return r;
    }, Object.create(null));
    let countries = [];
    UI.regions?.forEach(region => {
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
    View.setCountries(countries);
};

@observer
class FieldCountry extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    inputChanged(event, props) {
        props.formik.setFieldValue(codeField(props.id), "");

        var query = event.target.value;
        if (!query)
            return setCountrySuggestions([]);

        API.get({
            url: API.COUNTRIES_PREDICTION,
            body: { query },
            after: data => {
                setCountrySuggestions(data || []);
            }
        });
    };
    
    setValue(country, formik, connected) {
        setCountrySuggestions([]);

        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(codeField(connected), country.code);

        const anotherField = this.props.anotherField;
        if (anotherField)
            if (!formik.values[codeField(anotherField)]) {
                formik.setFieldValue(anotherField, country.name);
                formik.setFieldValue(codeField(anotherField), country.code);
            }
    }

    render() {
        const {
            formik,
            id,
            label,
            placeholder,
            anotherField,

            className,
            clearable,
            required
        } = this.props;

        return (
            <FieldText formik={formik}
                       id={id}
                       additionalFieldForValidation={codeField(id)}
                       label={label}
                       placeholder={placeholder}
                       Flag={<Flag code={formik.values[codeField(id)]} />}
                       Dropdown={CountryDropdown}
                       onChange={this.inputChanged}
                       options={View.countries}
                       setValue={this.setValue}
                       onClear={() => formik.setFieldValue(codeField(id), "")}

                       className={className}
                       clearable={clearable}
                       required={required}
            />
        );
    }
}

export default FieldCountry;