import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Formik } from "formik";
import { registrationUserValidator } from "components/form/validation";
import store from "stores/auth-store";
import FormUserData from "parts/form-user-data";
import { API  } from "core";
import UI from "stores/ui-store";

@observer
class RegistrationStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToThirdStep: false,
            redirectToIndexPage: false,
            initialValues: {
                "title": "",
                "firstName": "",
                "lastName": "",
                "position": ""
            }
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        store.setUserForm(values);
        if (this.state.invitationCode) {
            API.post({
                url: API.USER_REGISTRATION,
                body: {
                    registrationInfo: {
                        ...values,
                        email: this.state.initialValues.email
                    },
                    invitationCode: this.state.invitationCode
                },
                success: () => {
                    UI.setTopAlertText(null);
                    this.setState({ redirectToIndexPage: true });
                },
                error: (error) => {
                    UI.setTopAlertText(error?.title || error?.detail);
                    if (error && !(error?.title || error?.detail))
                        this.setState({ redirectToIndexPage: true });
                }
            });
        } else if (!this.state.redirectToThirdStep)
            this.setState({
                redirectToThirdStep: true
            });
    }

    componentDidMount() {
        var invitationCode = window.sessionStorage.getItem("_auth__invCode");
        if (invitationCode)
            API.get({
                url: API.USER_INVITE(invitationCode),
                success: data => {
                    this.setState({
                        invitationCode: invitationCode,
                        initialValues: data?.registrationInfo
                    });
                }
            });
    }

    render() {
        var { t } = useTranslation();
    
        if (this.state.redirectToThirdStep)
            return <Redirect push to="/signup/company" />;

        if (this.state.redirectToIndexPage)
            return <Redirect push to="/" />;

        var actionSteps = [t("Log In Information"), t("User Information")];
        if (!this.state.invitationCode)
            actionSteps.push(t("Company Information"));

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
                    text: t("User Information")
                }
            ]}/>
            <ActionSteps
                items={actionSteps}
                current={1}
                addClass="action-steps-another-bg"
            />
            <h1>
                Main user information
            </h1>
            <p>
                Create a free HappyTravel.com account and start booking today.
            </p>

        <Formik
            initialValues={this.state.initialValues}
            enableReinitialize={true}
            validationSchema={registrationUserValidator}
            onSubmit={this.submit}
            render={formik => (
                <form onSubmit={formik.handleSubmit}>
                    <div class="form">
                        <FormUserData formik={formik} t={t} />
                        <div class="row submit-holder">
                            <div class="field">
                                <div class="inner">
                                    <button type="submit" class="button">
                                        {t("Finish Registration")}
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