import React from "react";
import { Formik } from "formik";
import { $ui } from "stores";

class CachedForm extends React.Component {
    getInitialValues = () => {
        var {
            initialValues = {},
            cacheValidator,
            valuesOverwrite = values => values
        } = this.props,
            formName = this.props.id,
            cached = $ui.getFormCache(formName),
            isValid = false;

        if (!cached)
            return valuesOverwrite(initialValues);

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

    state = {
        initialValues: this.getInitialValues(),
        everSubmitted: false
    };

    handleReset = (formik) => {
        const {
            initialValues = {}
        } = this.props,
            formName = this.props.id;

        this.setState({ everSubmitted: false });
        formik.resetForm();
        formik.setValues(initialValues);
        $ui.setFormCache(formName, null);
    };

    handleChange = (values) => {
        $ui.setFormCache(this.props.id, values);
    };

    handleSubmit = (props, extended) => {
        this.setState({ everSubmitted: true });
        if (this.props.onSubmit)
            this.props.onSubmit(props, extended);
    };

    render() {
        var {
            onSubmit,
            validationSchema,
            render,
            enableReinitialize,
            initialValues,
            cacheValidator,
            valuesOverwrite
        } = this.props,
            formName = this.props.id;

        return (
            <Formik
                onSubmit={this.handleSubmit}
                validate={values => this.handleChange(values)}
                initialValues={!enableReinitialize ? this.state.initialValues : this.getInitialValues()}
                validationSchema={validationSchema}
                validateOnChange={true}
                validateOnMount={true}
                enableReinitialize={enableReinitialize}
            >
                {formik => (
                    <form onSubmit={formik.handleSubmit} className={__class(!this.state.everSubmitted, "never-submitted")}>
                        {render(formik, () => this.handleReset(formik) )}
                    </form>
                )}
            </Formik>
        );
    }
}

export default CachedForm;
