import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { userAuthSetToStorage } from "core/auth";
import { getInvite, forgetInvite } from "core/auth/invite";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { CachedForm, FieldText } from "components/form";
import { registrationUserValidator, registrationUserValidatorWithEmailAndAgencyName } from "components/form/validation";
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
                "position": "",
                "agencyName": ""
            },
            childAgencyRegistrationInfo: {},
            invitationCode: null
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        store.setRegistrationUserForm(values);
        if (this.state.invitationCode) {
            let url = API.AGENT_REGISTER;
            let body = {
                registrationInfo: {
                    ...values,
                    email: this.state.initialValues.email
                },
                invitationCode: this.state.invitationCode
            };
            if (this.state.childAgencyRegistrationInfo.name) {
                url = API.AGENCY_REGISTER;
                body = {
                    registrationInfo: {
                        ...values,
                        email: this.state.initialValues.email
                    },
                    childAgencyRegistrationInfo: {
                        ...this.state.childAgencyRegistrationInfo,
                        name: values.agencyName
                    },
                    invitationCode: this.state.invitationCode
                }
            }
            API.post({
                url,
                body,
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
                url: API.INVITATION_DATA(invitationCode),
                success: data => {
                    let initialValues = data?.userRegistrationInfo;
                    if (data?.childAgencyRegistrationInfo?.name)
                        initialValues = {
                            ...data.userRegistrationInfo,
                            agencyName: data.childAgencyRegistrationInfo.name
                        };
                    this.setState({
                        initialValues,
                        invitationCode: invitationCode,
                        childAgencyRegistrationInfo: data?.childAgencyRegistrationInfo
                    });
                }
            });
    }

    render() {
        let { t } = useTranslation();

        const { childAgencyRegistrationInfo, invitationCode, initialValues } = this.state;

        var actionSteps = [t("Login Information"), t("Agent Information")];
        if (!invitationCode)
            actionSteps.push(t("Company Information"));

        return (

<div className="account block sign-up-page">
    <section>
        <div className="logo-wrapper">
            <div className="logo" />
        </div>
        <div className="middle-section">
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
                className="action-steps-another-bg"
            />
            <h1>
                Agent Information
            </h1>
            <p>
                Create a new Happytravel.com account and start booking.
            </p>

        <CachedForm
            initialValues={initialValues}
            enableReinitialize
            validationSchema={
                childAgencyRegistrationInfo.name ?
                    registrationUserValidatorWithEmailAndAgencyName :
                    registrationUserValidator
            }
            onSubmit={this.submit}
            render={formik => (
                <div className="form">
                    { childAgencyRegistrationInfo.name ? <div className="row">
                        <FieldText
                            formik={formik}
                            id="agencyName"
                            label={t("Agency Name")}
                            placeholder={t("Agency Name")}
                            required
                        />
                    </div> : null }
                    <FormUserData formik={formik} t={t} />
                    <div className="row">
                        <div className="field">
                            <div className="inner">
                                <button type="submit" className="button">
                                    { invitationCode ?
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
