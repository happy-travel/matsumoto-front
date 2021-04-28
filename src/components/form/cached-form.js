import React, { useState } from "react";
import { Formik, Form } from "formik";
import { $ui } from "stores";

const CachedForm = ({
    initialValues = {},
    cacheValidator,
    valuesOverwrite = values => values,
    id,
    onSubmit,
    validationSchema,
    render
}) => {
    const [everSubmitted, setEverSubmitted] = useState(false);
    const [initialized, setInitialized] = useState(0);

    const getInitialValues = () => {
        let cached = $ui.getFormCache(id),
            isValid = false;

        if (!cached) {
            return valuesOverwrite(initialValues);
        }
        if (cacheValidator) {
            try {
                isValid = cacheValidator(cached);
            } catch (e) {}
        } else
            isValid = true;

        if (isValid)
            return valuesOverwrite(cached);

        return valuesOverwrite(initialValues);
    };

    const firstInitialValues = getInitialValues();

    const handleReset = (formik) => {
        setEverSubmitted(true);
        formik.resetForm();
        formik.setValues(initialValues);
        $ui.setFormCache(id, null);
    };

    const handleChange = (values) => {
        if (initialized)
            $ui.setFormCache(id, values);
        else
            setInitialized(true);
    };

    const handleSubmit = (props, extended) => {
        setEverSubmitted(true);
        if (onSubmit)
            onSubmit(props, extended);
    };

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={firstInitialValues}
            validate={handleChange}
            validationSchema={validationSchema}
            validateOnChange
            validateOnMount
            enableReinitialize
        >
            {formik => (
                <Form className={everSubmitted ? "" : "never-submitted"}>
                    {render(formik, () => handleReset(formik) )}
                </Form>
            )}
        </Formik>
    );
};

export default CachedForm;
