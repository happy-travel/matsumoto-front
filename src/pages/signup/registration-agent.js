import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import NotFoundPage from "pages/common/not-found-page";
import BasicHeader from "parts/header/basic-header";
import { authSetToStorage } from "core/auth";
import { getInvite, forgetInvite } from "core/auth/invite";
import { Loader } from "components/simple";
import Breadcrumbs from "components/breadcrumbs";
import { CachedForm, FieldText, FORM_NAMES } from "components/form";
import { registrationAgentValidator, registrationAgentValidatorWithEmailAndAgencyName } from "components/form/validation";
import { fillEmptyAgentSettings } from "simple/logic";
import FormAgentData from "parts/form-agent-data";
import { $personal, $notifications, $ui } from "stores";

export const finishAgentRegistration = (after) => {
    API.get({
        url: API.AGENT,
        success: (agent) => {
            authSetToStorage(agent);
            if (agent?.email) {
                $personal.setInformation(agent);
                $notifications.addNotification("Registration Completed!", "Great!", "success");
            }
            fillEmptyAgentSettings();
            forgetInvite();
            $ui.dropFormCache(FORM_NAMES.RegistrationAgentForm);
            $ui.dropFormCache(FORM_NAMES.RegistrationCounterpartyForm);
            $personal.setRegistrationAgentForm({});
            $personal.setRegistrationCounterpartyForm({});
        },
        after
    });
};

export const getAuthBlockStyle = () => {
    const dayOfYear = () => Math.round((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 1000 / 60 / 60 / 24);
    const backgrounds = ["bg01.svg", "bg02.svg", "bg03.svg", "bg04.svg", "bg05.svg", "bg06.svg"];
    return { backgroundImage: `url(/images/account/${backgrounds[dayOfYear() % backgrounds.length]})`};
};

const RegistrationAgent = observer(() => {
    const [loading, setLoading] = useState(false);
    const [invitationCode, setInvitationCode] = useState(false);
    const [childAgencyRegistrationInfo, setChildAgencyRegistrationInfo] = useState({});
    const [initialValues, setInitialValues] = useState({
        title: "",
        firstName: "",
        lastName: "",
        position: "",
        agencyName: ""
    });

    const submit = (values) => {
        $personal.setRegistrationAgentForm(values);
        if (invitationCode) {
            setLoading(true);
            let url = API.AGENT_REGISTER;
            let body = {
                registrationInfo: {
                    ...values,
                    email: initialValues.email
                },
                invitationCode: invitationCode
            };
            if (childAgencyRegistrationInfo.name) {
                url = API.AGENCY_REGISTER;
                body = {
                    registrationInfo: {
                        ...values,
                        email: initialValues.email
                    },
                    childAgencyRegistrationInfo: {
                        ...childAgencyRegistrationInfo,
                        name: values.agencyName
                    },
                    invitationCode: invitationCode
                }
            }
            API.post({
                url,
                body,
                success: () => {
                    finishAgentRegistration(() => setLoading(false));
                    redirect("/");
                },
                error: error => {
                    $notifications.addNotification(error?.title || error?.detail);
                    setLoading(false);
                }
            });
        } else
            redirect("/signup/counterparty");
    };

    useEffect(() => {
        const code = getInvite();
        if (code)
            API.get({
                url: API.INVITATION_DATA(code),
                success: (data) => {
                    let initials = data?.userRegistrationInfo;
                    if (data?.childAgencyRegistrationInfo?.name)
                        initials = {
                            ...data.userRegistrationInfo,
                            agencyName: data.childAgencyRegistrationInfo.name
                        };
                    setInitialValues(initials);
                    setInvitationCode(code);
                    setChildAgencyRegistrationInfo(data?.childAgencyRegistrationInfo);
                }
            });
    }, []);

    const { t } = useTranslation();

    if ($personal.information?.email)
        return <NotFoundPage />;

    return (

<div className="account block" style={getAuthBlockStyle()}>
    <BasicHeader />
    { loading &&
        <Loader page />
    }
    <section className="section">
        <div>
            <Breadcrumbs
                items={[
                    {
                        text: t("Sign In"),
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
                id={FORM_NAMES.RegistrationAgentForm}
                initialValues={initialValues}
                validationSchema={
                    childAgencyRegistrationInfo.name ?
                        registrationAgentValidatorWithEmailAndAgencyName :
                        registrationAgentValidator
                }
                onSubmit={submit}
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
});

export default RegistrationAgent;
