import React from "react";
import { price } from "core";
import { Formik } from "formik";
import UI from "stores/ui-store";

const handleChange = (formName, values) => {
    UI.setFormCache(formName, values);
};

const handleReset = (formName, formik, initialValues) => {
    formik.resetForm();
    formik.setValues(initialValues);
    UI.setFormCache(formName, null);
};

const getInitialValues = (formName, initialValues, cacheValidator) => {
    var cached = UI.getFormCache(formName),
        isValid = false;

    if (!cached)
        return initialValues;

    if (cacheValidator) {
        try {
            isValid = cacheValidator(cached);
        } catch (e) {}
    } else
        isValid = true;

    if (isValid)
        return cached;

    return initialValues;
};

class CachedForm extends React.Component {
    render() {
        var {
            onSubmit = () => {},
            initialValues = {},
            validationSchema,
            render,
            cacheValidator,
            enableReinitialize
        } = this.props,
            formName = this.props.id;

        return (
            <Formik
                onSubmit={onSubmit}
                validate={values => handleChange(formName, values)}
                initialValues={getInitialValues(formName, initialValues, cacheValidator)}
                validationSchema={validationSchema}
                validateOnChange={true}
                validateOnMount={true}
                enableReinitialize={enableReinitialize}
                render={formik => (
                    <form onSubmit={formik.handleSubmit}>
                        {render(formik, () => handleReset(formName, formik, initialValues) )}
                    </form>
                )}
            />
        );
    }
}

export default CachedForm;
