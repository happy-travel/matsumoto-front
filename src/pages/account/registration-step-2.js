import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { CachedForm, FORM_NAMES } from "components/form";
import { registrationUserValidator } from "components/form/validation";

import FormUserData from "parts/form-user-data";
import Authorize from "core/auth/authorize";

import store from "stores/auth-store";
import View from "stores/view-store";
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
                    API.get({
                        url: API.USER,
                        success: (result) => {
                            if (result?.email)
                                store.setUser(result);
                        }
                    });
                    store.setCachedUserRegistered(true);
                    UI.dropFormCache(FORM_NAMES.RegistrationStepTwoForm);
                    window.sessionStorage.removeItem("_auth__invCode");

                    this.setState({ redirectToIndexPage: true });
                },
                error: (error) => {
                    View.setTopAlertText(error?.title || error?.detail);
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
                url: API.USER_INVITE_DATA(invitationCode),
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
            return <Redirect push to="/signup/counterparty" />;

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
                    text: t("Log In"),
                    onClick: () => Authorize.signoutRedirect()
                }, {
                    text: t("Registration"),
                    onClick: () => Authorize.signoutRedirect()
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
                User information
            </h1>
            <p>
                Create a new HappyTravel.com account and start booking.
            </p>

        <CachedForm
            id={ FORM_NAMES.RegistrationStepTwoForm }
            initialValues={this.state.initialValues}
            enableReinitialize={true}
            validationSchema={registrationUserValidator}
            onSubmit={this.submit}
            render={formik => (
                <React.Fragment>
                    <div class="form">
                        <FormUserData formik={formik} t={t} />
                        <div class="row submit-holder">
                            <div class="field">
                                <div class="inner">
                                    <button type="submit" class="button">
                                        { this.state.invitationCode ?
                                            t("Finish Registration") :
                                            t("Continue Registration")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "60px" }}>
                            <span onClick={() => Authorize.signoutRedirect()} class="link">Log out</span>
                        </div>
                    </div>
                </React.Fragment>
            )}
        />
        </div>
    </section>
</div>

        );
    }
}

export default RegistrationStep2;
