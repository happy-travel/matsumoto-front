import React from "react";
import { Formik } from "formik";

import UI from "stores/ui-store";

class CachedForm extends React.Component {
    constructor(props) {
        super(props);
        this.getInitialValues = this.getInitialValues.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            initialized: false,
            initialValues: this.getInitialValues(),
            everSubmitted: false
        };
    }

    getInitialValues() {
        var {
            initialValues = {},
            cacheValidator,
            valuesOverwrite = values => values
        } = this.props,
            formName = this.props.id,
            cached = UI.getFormCache(formName),
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

    handleReset(formik) {
        const {
            initialValues = {}
        } = this.props,
            formName = this.props.id;

        this.setState({ everSubmitted: false });
        formik.resetForm();
        formik.setValues(initialValues);
        UI.setFormCache(formName, null);
    }

    handleChange(values) {
        UI.setFormCache(this.props.id, values);
    };

    handleSubmit(props, extended) {
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
                    <form onSubmit={formik.handleSubmit} class={__class(!this.state.everSubmitted, "never-submitted")}>
                        {render(formik, () => this.handleReset(formik) )}
                    </form>
                )}
            </Formik>
        );
    }
}

export default CachedForm;
