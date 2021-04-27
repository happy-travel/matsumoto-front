import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader } from "components/simple";
import { copyToClipboard } from "simple/logic";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { registrationAgentValidatorWithEmailAndAgencyName } from "components/form/validation";
import FormAgentData from "parts/form-agent-data";
import Breadcrumbs from "components/breadcrumbs";
import { $ui } from "stores";

const ChildAgencyInvitationPage = () => {
    const [success, setSuccess] = useState(false);
    const [name, setName] = useState("");
    const [form, setForm] = useState(null);

    const submit = (values) => {
        setSuccess(null);
        API.post({
            url: values.send ? API.CHILD_AGENCY_INVITE_SEND : API.CHILD_AGENCY_INVITE_GENERATE,
            body: {
                userRegistrationInfo: {
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    position: values.position,
                    title: values.title
                },
                childAgencyRegistrationInfo: {
                    name: values.agencyName
                }
            },
            success: data => {
                $ui.dropFormCache(FORM_NAMES.CreateInviteForm);
                setSuccess((values.send || !data) ?
                    true :
                    window.location.origin + "/signup/invite/" + values.email + "/" + data
                );
                setName((values.firstName || values.lastName) ? (values.firstName + " " + values.lastName) : null);
            },
            error: () => setSuccess(false)
        });
    };

    const reset = () => {
        setSuccess(false);
    };

    const submitButtonClick = (send, formik) => {
        formik.setFieldValue("send", send);
        formik.handleSubmit();
    };

    const { t } = useTranslation();

    return (
        <div className="settings block">
            <section>
                <Breadcrumbs items={[
                    {
                        text: t("Agency"),
                        link: "/settings/counterparty"
                    },
                    {
                        text: t("Child Agencies"),
                        link: "/settings/child-agencies"
                    }, {
                        text: t("Invitation")
                    }
                ]}/>
                <h2>{t("Invite child agency")}</h2>
                { success === null &&
                    <Loader />
                }
                { success && <div>
                    {success === true ?
                        <div>
                            { name ?
                                <h3>{t("Your invitation sent to")} {name}</h3> :
                                <h3>{t("Invitation sent")}</h3> }
                            <br/>
                        </div> :
                        <div>
                            <div className="form">
                                <h3>{t("Send this link as an invitation")}</h3>
                                <br/>
                                <FieldText
                                    value={success}
                                />
                            </div>
                            <br/>
                            <button className="button" style={{ marginBottom: 20 }} onClick={() => copyToClipboard(success)}>
                                {t("Copy to Clipboard")}
                            </button>
                        </div>}
                    <button className="button" onClick={reset}>
                        {t("Send one more invite")}
                    </button>
                </div> }

                { false === success && <CachedForm
                    id={FORM_NAMES.CreateInviteForm}
                    initialValues={{
                        agencyName: "",
                        email: "",
                        title: "",
                        firstName: "",
                        lastName: "",
                        position: ""
                    }}
                    validationSchema={registrationAgentValidatorWithEmailAndAgencyName}
                    onSubmit={submit}
                    render={formik => (
                        <div className="form">
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="agencyName"
                                    label={t("Child Agency Name")}
                                    placeholder={t("Child Agency Name")}
                                    required
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="email"
                                    label={t("Email")}
                                    placeholder={t("Email")}
                                    required
                                />
                            </div>
                            <FormAgentData formik={formik} />
                            <div className="row">
                                <div className="field" style={{ width: "50%" }}>
                                    <div className="inner">
                                        <button onClick={() => submitButtonClick(true, formik)}
                                                className={"button" + __class(!formik.isValid, "disabled")}>
                                            {t("Send Invitation")}
                                        </button>
                                    </div>
                                </div>
                                <div className="field" style={{ width: "50%" }}>
                                    <div className="inner">
                                        <button onClick={() => submitButtonClick(false, formik)}
                                                className={"button" + __class(!formik.isValid, "disabled")}>
                                            {t("Generate Invitation Link")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                /> }
            </section>
        </div>
    );
};

export default ChildAgencyInvitationPage;
