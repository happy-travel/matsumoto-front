import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import BasicHeader from "parts/header/basic-header";
import { authSetToStorage } from "core/auth";
import { getInvite, forgetInvite } from "core/auth/invite";
import Breadcrumbs from "components/breadcrumbs";
import { CachedForm, FieldText } from "components/form";
import { registrationAgentValidator, registrationAgentValidatorWithEmailAndAgencyName } from "components/form/validation";
import { fillEmptyAgentSettings } from "simple/logic";
import FormAgentData from "parts/form-agent-data";
import { $personal, $notifications } from "stores";

export const finishAgentRegistration = () => {
    API.get({
        url: API.AGENT,
        success: (agent) => {
            authSetToStorage(agent);
            if (agent?.email) {
                $personal.setInformation(agent);
                $notifications.addNotification("Registration Completed!", "Great!", "success");
            }
            fillEmptyAgentSettings();
        }
    });

    forgetInvite();
    $personal.$setRegistrationAgentForm({});
    $personal.setRegistrationCounterpartyForm({});
};

@observer
class RegistrationAgent extends React.Component {
    state = {
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

    submit = (values) => {
        $personal.$setRegistrationAgentForm(values);
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
                    $notifications.addNotification(error?.title || error?.detail);
                    if (error && !(error?.title || error?.detail))
                        redirect("/");
                }
            });
        } else
            redirect("/signup/counterparty");
    };

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

        return (

<div className="account block" style={{ backgroundImage: `url(/images/bg04.svg)`}}>
    <BasicHeader />
    <section className="section">
        <div>
            <Breadcrumbs
                items={[
                    {
                        text: t("Log In"),
                        link: "/logout"
                    }, {
                        text: t("Registration"),
                        link: "/logout"
                    }, {
                        text: t("Agent Information")
                    }
                ]}
                 noBackButton
            />
            <h2>
                Agent Information
            </h2>
            <div className="paragraph">
                Create a new Happytravel.com account and start booking.
            </div>

            <CachedForm
                initialValues={initialValues}
                enableReinitialize
                validationSchema={
                    childAgencyRegistrationInfo.name ?
                        registrationAgentValidatorWithEmailAndAgencyName :
                        registrationAgentValidator
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
                        <FormAgentData formik={formik} />
                        <div className="row">
                            <div className="field">
                                <div className="inner">
                                    <button type="submit" className="button main">
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
