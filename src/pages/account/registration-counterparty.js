import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { API, redirect } from "core";
import { finishAgentRegistration } from "./registration-agent";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import {
    CachedForm,
    FORM_NAMES,
    FieldText,
    FieldTextarea,
    FieldSelect
} from "components/form";
import FieldCountry from "components/complex/field-country";
import { registrationCounterpartyValidator } from "components/form/validation";
import store from "stores/auth-store";
import Notifications from "stores/notifications-store";
import UI from "stores/ui-store";

@observer
class RegistrationCounterparty extends React.Component {
    submit = (values) => {
        store.setRegistrationCounterpartyForm(values);

        API.post({
            url: API.AGENT_REGISTER_MASTER,
            body: store.registration,
            success: () => {
                finishAgentRegistration();
                UI.dropFormCache(FORM_NAMES.RegistrationStepThreeForm);
                redirect("/");
            },
            error: error => {
                Notifications.addNotification(error?.title || error?.detail);
                if (error && !(error?.title || error?.detail))
                    redirect("/");
            }
        });
    };

    render() {
        var { t } = useTranslation();

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
                                text: t("Company Information")
                            }
                        ]}/>
                        <ActionSteps
                            items={[t("Login Information"), t("Agent Information"), t("Company Information")]}
                            current={2}
                            className="action-steps-another-bg"
                        />
                        <h1>
                            Company Information
                        </h1>
                        <p>
                            Create a free Happytravel.com account and start booking today.<br/>
                            Already have an account? <Link to="/logout" className="link">Log In Here.</Link>
                        </p>

                        <CachedForm
                            id={ FORM_NAMES.RegistrationCounterpartyForm }
                            initialValues={{
                                "name": "",
                                "address": "",
                                "country": "",
                                "countryCode": "",
                                "city": "",
                                "phone": "",
                                "fax": "",
                                "preferredPaymentMethod": "",
                                "website": "",
                                "postalCode": ""
                            }}
                            validationSchema={registrationCounterpartyValidator}
                            onSubmit={this.submit}
                            render={formik => (
                                <div className="form">
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id="name"
                                                   label={t("Company Name")}
                                                   placeholder={t("Company Name")}
                                                   required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldTextarea formik={formik}
                                                       id="address"
                                                       label={t("Company Address")}
                                                       placeholder={t("Company Address")}
                                                       required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id={"postalCode"}
                                                   label={t("Zip/Postal Code")}
                                                   placeholder={t("Zip/Postal Code")}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldCountry formik={formik}
                                                      id="country"
                                                      label={t("Country")}
                                                      placeholder={t("Country")}
                                                      required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id="city"
                                                   label={t("City")}
                                                   placeholder={t("City")}
                                                   required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldSelect formik={formik}
                                                     id="preferredPaymentMethod"
                                                     label={t("Preferred Payment Method")}
                                                     required
                                                     placeholder={t("Preferred Payment Method")}
                                                     options={[
                                                         { value: "VirtualAccount", text: "Virtual credit"},
                                                         { value: "CreditCard", text: "Credit card"}
                                                     ]}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id="phone"
                                                   label={t("Telephone")}
                                                   placeholder={t("Telephone")}
                                                   required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id="fax"
                                                   label={t("Fax")}
                                                   placeholder={t("Fax")}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText formik={formik}
                                                   id="website"
                                                   label={t("Website")}
                                                   placeholder={t("Website")}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="field">
                                            <div className="inner">
                                                <button type="submit" className={"button" + __class(!formik.isValid, "disabled")}>
                                                    {t("Get started")}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="field terms">
                                            By clicking this button, you agree with <Link to="/terms" className="link">HappyTravel’s Terms of Use.</Link>
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

export default RegistrationCounterparty;
