import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Formik } from "formik";
import { FieldText } from "components/form";
import store from "stores/auth-store";

@observer
class RegistrationStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToThirdStep: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        store.setUserForm(values);
        console.log('21');
        if (!this.state.redirectToThirdStep)
            this.setState({
                redirectToThirdStep: true
            });
    }

    render() {
        var { t } = useTranslation();
    
        if (this.state.redirectToThirdStep)
            return <Redirect push to="/signup/company" />;

        return (

<div class="account block sign-up-page">
    <section>
        <div class="logo-wrapper">
            <div class="logo" />
        </div>
        <div class="middle-section">
            <Breadcrumbs items={[
                {
                    text: t("Log In")
                }, {
                    text: t("Registration")
                }, {
                    text: t("Company Information")
                }
            ]}/>
            <ActionSteps
                items={[t("Log In Information"), t("User Information"), t("Company Information")]}
                current={1}
                addClass="action-steps-another-bg"
            />
            <h1>
                Main user information
            </h1>
            <p>
                Create a free HappyTravel account and start booking today.<br/>
                Already have an account? <a href="/" class="link">Log In Here.</a> {/* todo: logout */}
            </p>

            <Formik
            initialValues={{

            }}
            validate={values => {
                let errors = {};
                return errors;
            }}
            onSubmit={values=>this.submit(values)}
            render={formik => (
                <form onSubmit={formik.handleSubmit}>
                    <div class="form">
                        <div class="row">
                            <FieldText formik={formik}
                                id={"title"}
                                label={t("Salutation")}
                                placeholder={t("Select One")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"firstName"}
                                label={t("First Name")}
                                placeholder={t("First Name")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"lastName"}
                                label={t("Last Name")}
                                placeholder={t("Last Name")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"position"}
                                label={t("Position/Designation")}
                                placeholder={t("Position/Designation")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"email"}
                                label={t("E-mail Address")}
                                placeholder={t("Enter your E-mail Address")}
                                required
                            />
                        </div>
                        <div class="error-field">
                            {/*todo*/}
                        </div>
                        <div class="row">
                            <div class="field">
                                <div class="inner">
                                    <button type="submit" class="button">
                                        {t("Continue registration")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        />
        </div>
    </section>
</div>

        );
    }
}

export default RegistrationStep2;