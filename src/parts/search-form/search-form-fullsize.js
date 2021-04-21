import React from "react";
import FieldDestination from "components/complex/field-destination";
import { FieldDatepicker, FieldText } from "components/form";
import { useTranslation } from "react-i18next";
import PeopleDropdown from "components/form/dropdown/room-details-dropdown";
import { countPassengers } from "simple/logic";
import FieldCountry from "components/complex/field-country";

const SearchFormFullsizePart = ({ formik }) => {
    const { t } = useTranslation();
    return (
        <div className="form fullsize">
            <div className="row">
                <FieldDestination
                    formik={formik}
                    id="destination"
                    label={t("Destination, Hotel Name, Location or Landmark")}
                    placeholder={t("Destination or Hotel Name")}
                />
                <FieldDatepicker
                    formik={formik}
                    id="dates"
                    first="checkInDate"
                    second="checkOutDate"
                    label={t("Check-in - Check-out")}
                    placeholder={t("Dates")}
                    className="size-one"
                />
                <FieldText
                    formik={formik}
                    id="room"
                    label={t("Adults, Children, Rooms")}
                    placeholder={t("Choose options")}
                    className="size-one"
                    Dropdown={PeopleDropdown}
                    Icon={<span className="icon icon-search-guests" />}
                    value={[
                        __plural(t, countPassengers(formik.values, "adultsNumber"), "Adult"),
                        __plural(t, countPassengers(formik.values, "childrenNumber"), "Children"),
                        __plural(t, formik.values.roomDetails.length, "Room")
                    ].join(" • ")}
                />
            </div>
            <div className="row">
                <FieldCountry
                    formik={formik}
                    id="nationality"
                    anotherField="residency"
                    label={t("Nationality")}
                    placeholder={t("Choose your nationality")}
                    className="size-two"
                    clearable
                />
                <FieldCountry
                    formik={formik}
                    id="residency"
                    anotherField="nationality"
                    label={t("Residency")}
                    placeholder={t("Choose your residency")}
                    className="size-two"
                    clearable
                />
                <div className="field">
                    <div className="inner button-holder">
                        <button type="submit" className="main button">
                            {t("Search Accommodations")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFormFullsizePart;
