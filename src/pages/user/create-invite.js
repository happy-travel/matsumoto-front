import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Formik } from "formik";
import { FieldText } from "components/form";
import { registrationUserValidatorWithEmail } from "components/form/validation";
import UI from "stores/ui-store";
import FormUserData from "parts/form-user-data";
import { Loader } from "components/simple";

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
            url: API.USER_INVITE(),
            body: {
                email: values.email,
                companyId: UI.user.companies[0].id,
                registrationInfo: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    position: values.position,
                    title: values.title
                }
            },
            success: () => this.setState({ success: true }),
            error: (error) => {
                this.setState({ success: false });
                UI.setTopAlertText(error?.title || error?.detail);
            }
        });
    }

    reset() {
        this.setState({ success: false });
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
            { this.state.success && <p>
                {t("Your invitation sent.")}<br/>
                <br/>
                <button class="button payment-back" onClick={this.reset}>
                    {t("Send one more invite")}
                </button>
            </p> }
            { false === this.state.success && <p>
                {t("Invite someone to create a free HappyTravel.com account and start booking today.")}<br/>
                <br/>
            </p> }

            { false === this.state.success && <Formik
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
                    <form onSubmit={formik.handleSubmit}>
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
                                        <button type="submit" class={"button" + (formik.isValid ? "" : " disabled")}>
                                            {t("Send invitation")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            /> }
        </div>
    </section>
</div>

        );
    }
}

export default UserInvitePage;