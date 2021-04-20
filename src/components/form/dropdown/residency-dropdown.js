import React from "react";
import { useTranslation } from "react-i18next";
import FieldCountry from "components/complex/field-country";

const ResidencyDropdown = ({ formik }) => {
    const { t } = useTranslation();

    return (
        <div className="residency dropdown">
            <FieldCountry
                formik={formik}
                id="nationality"
                anotherField="residency"
                label={t("Nationality")}
                placeholder={t("Choose your nationality")}
                clearable
            />
            <FieldCountry
                formik={formik}
                id="residency"
                anotherField="nationality"
                label={t("Residency")}
                placeholder={t("Choose your residency")}
                clearable
            />
            {/* todo
                <FieldCheckbox
                    onChange={setSame}
                    value={true}
                    label={t("Residency similar as Nationality")}
                />
            */}
        </div>
    );
};

export default ResidencyDropdown;
