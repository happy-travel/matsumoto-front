import React from "react";
import { FieldText, FieldSelect } from "components/form";

export default ({
    formik, t
}) => (
    <React.Fragment>
        <div class="row">
            <FieldSelect formik={formik}
                id="title"
                label={t("Salutation")}
                required
                placeholder={t("Select One")}
                options={[
                    { value: "Mr.", text: t("Mr.")},
                    { value: "Ms.", text: t("Ms.")},
                    { value: "Miss.", text: t("Miss.")},
                    { value: "Mrs.", text: t("Mrs.")}
                ]}
            />
        </div>
        <div class="row">
            <FieldText formik={formik}
                id="firstName"
                label={t("First Name")}
                placeholder={t("First Name")}
                required
            />
        </div>
        <div class="row">
            <FieldText formik={formik}
                id="lastName"
                label={t("Last Name")}
                placeholder={t("Last Name")}
                required
            />
        </div>
        <div class="row">
            <FieldText formik={formik}
                id="position"
                label={t("Position/Designation")}
                placeholder={t("Position/Designation")}
                required
            />
        </div>
    </React.Fragment>
);
