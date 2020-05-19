import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { registrationUserValidatorWithEmail } from "components/form/validation";
import UI from "stores/ui-store";
import AuthStore from "stores/auth-store";
import View from "stores/view-store";
import FormUserData from "parts/form-user-data";
import { Loader } from "components/simple";

const copyToClipboard = text => {
    if (window.clipboardData && window.clipboardData.setData) {
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
};

@observer
class UserInvitePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false
        };
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
    }

    submit(values) {
        this.setState({ success: null });
        API.post({
            url: values.send ? API.USER_INVITE_SEND : API.USER_INVITE_GET_LINK,
            body: {
                email: values.email,
                agencyId: AuthStore.activeCounterparty.id,
                registrationInfo: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    position: values.position,
                    title: values.title
                }
            },
            success: data => {
                UI.dropFormCache(FORM_NAMES.CreateInviteForm);
                this.setState({
                    success:
                        (values.send || !data) ?
                        true :
                        window.location.origin + "/signup/invite/" + values.email + "/" + data
                });
            },
            error: (error) => {
                this.setState({ success: false });
                View.setTopAlertText(error?.title || error?.detail);
            }
        });
    }

    reset() {
        this.setState({ success: false });
    }

    submitButtonClick(send, formik) {
        formik.setFieldValue("send", send);
        formik.handleSubmit();
    }

    render() {
        var { t } = useTranslation();

        return (

<div class="confirmation management block">
    <section class="double-sections">
        <div class="middle-section">
            <h2 class="payment-title">
                {t("Invite a user to your company")}
            </h2>
            { this.state.success === null &&
                <Loader />
            }
            { this.state.success && <div>
                {this.state.success === true ?
                <div>
                    <h2>{t("Your invitation sent")}</h2>
                    <br/>
                </div> :
                <div>
                    <div class="form">
                        <h2>{t("Send this link as invite")}</h2>
                        <FieldText
                            value={this.state.success}
                        />
                    </div>
                    <br/>
                    <button class="button small" onClick={() => copyToClipboard(this.state.success)}>
                        {t("Copy to clipboard")}
                    </button>
                </div>}
                <div style={{ marginTop: "100px" }}>
                    <button class="button payment-back" onClick={this.reset}>
                        {t("Send one more invite")}
                    </button>
                </div>
            </div> }
            { false === this.state.success && <p>
                {t("Invite someone to create a free HappyTravel.com account and start booking today.")}<br/>
                <br/>
            </p> }

            { false === this.state.success && <CachedForm
                id={FORM_NAMES.CreateInviteForm}
                initialValues={{
                    "email": "",
                    "title": "",
                    "firstName": "",
                    "lastName": "",
                    "position": ""
                }}
                validationSchema={registrationUserValidatorWithEmail}
                onSubmit={this.submit}
                render={formik => (
                    <React.Fragment>
                        <div class="form">
                            <div class="row">
                                <FieldText formik={formik}
                                    id="email"
                                    label={t("Email")}
                                    placeholder={t("Email")}
                                    required
                                />
                            </div>
                            <FormUserData formik={formik} t={t} />
                            <div class="row submit-holder">
                                <div class="field">
                                    <div class="inner">
                                        <button onClick={() => this.submitButtonClick(true, formik)} class={"button" + (formik.isValid ? "" : " disabled")}>
                                            {t("Send invitation")}
                                        </button>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="inner">
                                        <button onClick={() => this.submitButtonClick(false, formik)} class={"button" + (formik.isValid ? "" : " disabled")}>
                                            {t("Generate invitation link")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            /> }
        </div>
    </section>
</div>

        );
    }
}

export default UserInvitePage;