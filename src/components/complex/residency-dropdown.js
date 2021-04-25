import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FieldCountry from "components/complex/field-country";
import { FieldCheckbox } from "components/form";

const ResidencyDropdown = ({ formik }) => {
    const { t } = useTranslation();

    const [same, setSame] = useState(true);

    useEffect(() => {
        if (formik.values.nationalityCode != formik.values.residencyCode)
            setSame(false);
    }, []);

    return (
        <div className="residency dropdown">
            <FieldCountry
                formik={formik}
                id="nationality"
                anotherField="residency"
                label={t("Nationality")}
                placeholder={t("Choose your nationality")}
                forceAnotherField={same}
                clearable
            />
            <div hidden={same}>
                <FieldCountry
                    formik={formik}
                    id="residency"
                    anotherField="nationality"
                    label={t("Residency")}
                    placeholder={t("Choose your residency")}
                    clearable
                />
            </div>
            <div hidden={!same}>
                <FieldCheckbox
                    onChange={setSame}
                    value={true}
                    label={t("Residency similar as Nationality")}
                />
            </div>
        </div>
    );
};

export default ResidencyDropdown;
