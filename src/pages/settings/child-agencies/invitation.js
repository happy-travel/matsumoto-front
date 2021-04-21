import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader } from "components/simple";
import { copyToClipboard } from "simple/logic";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { registrationAgentValidatorWithEmailAndAgencyName } from "components/form/validation";
import FormAgentData from "parts/form-agent-data";
import Breadcrumbs from "components/breadcrumbs";
import { $ui } from "stores";

@observer
class ChildAgencyInvitationPage extends React.Component {
    state = {
        success: false,
        form: null
    };

    submit = (values) => {
        this.setState({ success: null });
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
                this.setState({
                    success:
                        (values.send || !data) ?
                            true :
                            window.location.origin + "/signup/invite/" + values.email + "/" + data,
                    name: (values.firstName || values.lastName) ? (values.firstName + " " + values.lastName) : null
                });
            },
            error: () => this.setState({ success: false })
        });
    };

    reset = () => {
        this.setState({ success: false });
    };

    submitButtonClick(send, formik) {
        formik.setFieldValue("send", send);
        formik.handleSubmit();
    }

    render() {
        var { t } = useTranslation();

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
                    { this.state.success === null && <Loader /> }
                    { this.state.success && <div>
                        {this.state.success === true ?
                            <div>
                                { this.state.name ?
                                    <h3>{t("Your invitation sent to")} {this.state.name}</h3> :
                                    <h3>{t("Your invitation sent")}</h3> }
                                <br/>
                            </div> :
                            <div>
                                <div className="form">
                                    <h3>{t("Send this link as an invitation")}</h3>
                                    <br/>
                                    <FieldText
                                        value={this.state.success}
                                    />
                                </div>
                                <br/>
                                <button className="button" style={{ marginBottom: 20 }} onClick={() => copyToClipboard(this.state.success)}>
                                    {t("Copy to Clipboard")}
                                </button>
                            </div>}
                        <button className="button" onClick={this.reset}>
                            {t("Send one more invite")}
                        </button>
                    </div> }

                    { false === this.state.success && <CachedForm
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
                        onSubmit={this.submit}
                        render={formik => (
                            <div className="form">
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="agencyName"
                                               label={t("Child Agency Name")}
                                               placeholder={t("Child Agency Name")}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="email"
                                               label={t("Email")}
                                               placeholder={t("Email")}
                                               required
                                    />
                                </div>
                                <FormAgentData formik={formik} />
                                <div className="row">
                                    <div className="field">
                                        <div className="inner">
                                            <button onClick={() => this.submitButtonClick(true, formik)}
                                                    className={"button" + __class(!formik.isValid, "disabled")}>
                                                {t("Send Invitation")}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="inner">
                                            <button onClick={() => this.submitButtonClick(false, formik)}
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
    }
}

export default ChildAgencyInvitationPage;
