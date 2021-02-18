import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { userAuthSetToStorage } from "core/auth";
import { getInvite, forgetInvite } from "core/auth/invite";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { CachedForm } from "components/form";
import { registrationUserValidator } from "components/form/validation";
import { fillEmptyUserSettings } from "simple/logic";
import FormUserData from "parts/form-user-data";
import store from "stores/auth-store";
import Notifications from "stores/notifications-store";

export const finishAgentRegistration = () => {
    API.get({
        url: API.AGENT,
        success: (user) => {
            userAuthSetToStorage(user);
            if (user?.email)
                store.setUser(user);
            fillEmptyUserSettings();
        }
    });

    forgetInvite();
    store.setRegistrationUserForm({});
    store.setRegistrationCounterpartyForm({});
};

@observer
class RegistrationAgent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        store.setRegistrationUserForm(values);
        if (this.state.invitationCode) {
            API.post({
                url: API.AGENT_REGISTER,
                body: {
                    registrationInfo: {
                        ...values,
                        email: this.state.initialValues.email
                    },
                    invitationCode: this.state.invitationCode
                },
                success: () => {
                    finishAgentRegistration();
                    redirect("/");
                },
                error: error => {
                    Notifications.addNotification(error?.title || error?.detail);
                    if (error && !(error?.title || error?.detail))
                        redirect("/");
                }
            });
        } else
            redirect("/signup/counterparty");
    }

    componentDidMount() {
        var invitationCode = getInvite();
        if (invitationCode)
            API.get({
                url: API.AGENT_INVITE_DATA(invitationCode),
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

        var actionSteps = [t("Login Information"), t("Agent Information")];
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
                    link: "/logout"
                }, {
                    text: t("Registration"),
                    link: "/logout"
                }, {
                    text: t("Agent Information")
                }
            ]}/>
            <ActionSteps
                items={actionSteps}
                current={1}
                addClass="action-steps-another-bg"
            />
            <h1>
                Agent Information
            </h1>
            <p>
                Create a new Happytravel.com account and start booking.
            </p>

        <CachedForm
            initialValues={this.state.initialValues}
            enableReinitialize
            validationSchema={registrationUserValidator}
            onSubmit={this.submit}
            render={formik => (
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
                </div>
            )}
        />
        </div>
    </section>
</div>
        );
    }
}

export default RegistrationAgent;
