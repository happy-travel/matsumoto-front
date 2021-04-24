import React from "react";
import { useTranslation } from "react-i18next";
import FieldDestination from "components/complex/field-destination";
import { FieldDatepicker, FieldText } from "components/form";
import { Flag } from "components/simple";
import PeopleDropdown from "components/complex/room-details-dropdown";
import ResidencyDropdown from "components/complex/residency-dropdown";
import { countPassengers } from "simple/logic";

const countryElement = (code) => (
    <span className="element">
        <Flag code={code} /> {code.toLowerCase()}
    </span>
);

const generateCountriesValue = (values) => {
    if (!values.nationalityCode || !values.residencyCode)
        return null;

    return (
        <span className="flags">
            {countryElement(values.nationalityCode)}
            { values.nationalityCode !== values.residencyCode &&
                countryElement(values.residencyCode)
            }
        </span>
    );
};

const SearchFormShortPart = ({ formik }) => {
    const { t } = useTranslation();
    return (
        <div className="form short">
            <FieldDestination
                formik={formik}
                id="destination"
                placeholder={t("Destination")}
                short
            />
            <FieldDatepicker
                formik={formik}
                id="dates"
                first="checkInDate"
                second="checkOutDate"
                placeholder={t("Dates")}
                short
            />
            <FieldText
                noInput
                formik={formik}
                id="room"
                Dropdown={PeopleDropdown}
                Icon={<span className="icon icon-search-guests"/>}
                value={true}
                ValueObject={__plural(t, countPassengers(formik.values), "Guest")}
            />
            <FieldText
                noInput
                formik={formik}
                id="residencyPicker"
                placeholder={t("Select")}
                Dropdown={ResidencyDropdown}
                ValueObject={generateCountriesValue(formik.values)}
                value={formik.values.nationalityCode && formik.values.residencyCode}
            />
            <div className="field button-holder">
                <button type="submit" className="main button">
                    <span className="icon icon-search-white"/>
                </button>
            </div>
        </div>
    );
};

export default SearchFormShortPart;
