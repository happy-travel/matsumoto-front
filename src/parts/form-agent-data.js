import React from "react";
import { useTranslation } from "react-i18next";
import { FieldText, FieldSelect } from "components/form";

const FormAgentData = ({ formik }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="row">
                <FieldSelect formik={formik}
                    id="title"
                    label={t("Salutation")}
                    required
                    placeholder={t("Select")}
                    options={[
                        { value: "Mr", text: t("Mr.")},
                        { value: "Ms", text: t("Ms.")},
                        { value: "Miss", text: t("Miss")},
                        { value: "Mrs", text: t("Mrs.")}
                    ]}
                />
            </div>
            <div className="row">
                <FieldText formik={formik}
                    id="firstName"
                    label={t("First Name")}
                    placeholder={t("First Name")}
                    required
                />
            </div>
            <div className="row">
                <FieldText formik={formik}
                    id="lastName"
                    label={t("Last Name")}
                    placeholder={t("Last Name")}
                    required
                />
            </div>
            <div className="row">
                <FieldText formik={formik}
                    id="position"
                    label={t("Position (Designation)")}
                    placeholder={t("Position (Designation)")}
                    required
                />
            </div>
        </>
    );
};

export default FormAgentData;
