import React from "react";
import { observer } from "mobx-react";
import { API } from "core";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Formik } from "formik";
import { FieldText } from "components/form";
import store from "stores/auth-store";

@observer
class RegistrationStep3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToIndexPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values, { setSubmitting }) {
        store.setCompanyForm(values);

        var redirect = this.setState.bind(this, {
            redirectToIndexPage: true
        });

        API.post({
            url: API.USER_REGISTRATION,
            body: store.registration,
            after: () => {
                redirect();
            } /* todo: handle errors */
        });
    }

    render() {
        var { t } = useTranslation();
    
        if (this.state.redirectToIndexPage)
            return <Redirect push to="/" />;

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
                current={2}
                addClass="action-steps-another-bg"
            />
            <h1>
                Company Information
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
            onSubmit={this.submit}
            render={formik => (
                <form onSubmit={formik.handleSubmit}>
                    <div class="form">
                        <div class="row">
                            <FieldText formik={formik}
                                id={"name"}
                                label={t("Company Name")}
                                placeholder={t("Company Name")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"address"}
                                label={t("Company Address")}
                                placeholder={t("Company Address")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"zip"}
                                label={t("Zip/Postal Code")}
                                placeholder={t("Zip/Postal Code")}
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"countryCode"}
                                label={t("Country")}
                                placeholder={t("Country")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"city"}
                                label={t("City")}
                                placeholder={t("City")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"preferredPaymentMethod"}
                                label={t("Preferred Payment Method")}
                                placeholder={t("Preferred Payment Method")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"preferredCurrency"}
                                label={t("Preferred currency")}
                                placeholder={t("Preferred currency")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"phone"}
                                label={t("Telephone")}
                                placeholder={t("Telephone")}
                                required
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"fax"}
                                label={t("Fax")}
                                placeholder={t("Fax")}
                            />
                        </div>
                        <div class="row">
                            <FieldText formik={formik}
                                id={"website"}
                                label={t("Website")}
                                placeholder={t("Website")}
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

export default RegistrationStep3;