import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BasicHeader from "parts/header/basic-header";
import { API, redirect } from "core";
import { PAYMENT_METHODS } from "enum";
import { finishAgentRegistration } from "./registration-agent";
import Breadcrumbs from "components/breadcrumbs";
import { CachedForm, FORM_NAMES, FieldText, FieldTextarea, FieldSelect } from "components/form";
import FieldCountry from "components/complex/field-country";
import { registrationCounterpartyValidator } from "components/form/validation";
import { $personal, $notifications, $ui } from "stores";

@observer
class RegistrationCounterparty extends React.Component {
    submit = (values) => {
        $personal.setRegistrationCounterpartyForm(values);

        API.post({
            url: API.AGENT_REGISTER_MASTER,
            body: $personal.registration,
            success: () => {
                finishAgentRegistration();
                $ui.dropFormCache(FORM_NAMES.RegistrationStepThreeForm);
                redirect("/");
            },
            error: error => {
                $notifications.addNotification(error?.title || error?.detail);
                if (error && !(error?.title || error?.detail))
                    redirect("/");
            }
        });
    };

    render() {
        var { t } = useTranslation();

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
                                    text: t("Company Information")
                                }
                            ]}
                            noBackButton
                        />
                        <h2>
                            Company Information
                        </h2>
                        <div className="paragraph">
                            Create a free Happytravel.com account and start booking today<br/>
                            Already have an account? <Link to="/logout" className="link">Log In Here</Link>
                        </div>

                        <CachedForm
                            id={ FORM_NAMES.RegistrationCounterpartyForm }
                            initialValues={{
                                "name": "",
                                "address": "",
                                "legalAddress": "",
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
                                        <FieldText
                                            formik={formik}
                                            id="name"
                                            label={t("Company Name")}
                                            placeholder={t("Company Name")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldTextarea
                                            formik={formik}
                                            id="address"
                                            label={t("Company Address")}
                                            placeholder={t("Company Address")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldTextarea
                                            formik={formik}
                                            id="legalAddress"
                                            label={t("Legal Address")}
                                            placeholder={t("Legal Address")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText
                                            formik={formik}
                                            id={"postalCode"}
                                            label={t("Zip/Postal Code")}
                                            placeholder={t("Zip/Postal Code")}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldCountry
                                            formik={formik}
                                            id="country"
                                            label={t("Country")}
                                            placeholder={t("Country")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText
                                            formik={formik}
                                            id="city"
                                            label={t("City")}
                                            placeholder={t("City")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldSelect
                                            formik={formik}
                                            id="preferredPaymentMethod"
                                            label={t("Preferred Payment Method")}
                                            required
                                            placeholder={t("Preferred Payment Method")}
                                            options={[
                                                { value: PAYMENT_METHODS.ACCOUNT, text: "Virtual Credit"},
                                                { value: PAYMENT_METHODS.CARD, text: "Credit Card"},
                                                { value: PAYMENT_METHODS.OFFLINE, text: <>Offline <em>(Bank transfer, cash)</em></> }
                                            ]}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText
                                            formik={formik}
                                            id="phone"
                                            label={t("Phone")}
                                            placeholder={t("Phone")}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText
                                            formik={formik}
                                            id="fax"
                                            label={t("Fax")}
                                            placeholder={t("Fax")}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldText
                                            formik={formik}
                                            id="website"
                                            label={t("Website")}
                                            placeholder={t("Website")}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="field">
                                            <div className="inner">
                                                <button type="submit" className={"main button" + __class(!formik.isValid, "disabled")}>
                                                    {t("Get started")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="paragraph" style={{ paddingLeft: 0 }}>
                                        By clicking this button, you agree with <Link to="/terms" className="link">HappyTravel’s Terms of Use</Link>
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
