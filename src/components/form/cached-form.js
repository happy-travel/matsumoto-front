import React from "react";
import { Formik } from "formik";
import UI from "stores/ui-store";

class CachedForm extends React.Component {
    constructor(props) {
        super(props);
        this.getInitialValues = this.getInitialValues.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            initialized: false,
            initialValues: this.getInitialValues()
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

        formik.resetForm();
        formik.setValues(initialValues);
        UI.setFormCache(formName, null);
    }

    handleChange(values) {
        UI.setFormCache(this.props.id, values);
    };

    render() {
        var {
            onSubmit = () => {},
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
                onSubmit={onSubmit}
                validate={values => this.handleChange(values)}
                initialValues={!enableReinitialize ? this.state.initialValues : this.getInitialValues()}
                validationSchema={validationSchema}
                validateOnChange={true}
                validateOnMount={true}
                enableReinitialize={enableReinitialize}
                render={formik => (
                    <form onSubmit={formik.handleSubmit}>
                        {render(formik, () => this.handleReset(formik) )}
                    </form>
                )}
            />
        );
    }
}

export default CachedForm;
