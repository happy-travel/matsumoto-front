import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PAYMENT_METHODS } from "enum";
import Breadcrumbs from "components/breadcrumbs";
import { CachedForm, FORM_NAMES, FieldText, FieldTextarea, FieldSelect } from "components/form";
import FieldCountry from "components/complex/field-country";
import { registrationCompanyValidator } from "components/form/validation";

const SignUpCompanyForm = ({ submit, initialValues, setAgentFilledForm, agencyWay, counterpartyWay }) => {
    const { t } = useTranslation();
    return (
        <div>
            <Breadcrumbs
                items={[
                    {
                        text: t("Registration"),
                        link: "/logout"
                    },{
                        text: t("Agent Information"),
                        link: "/signup",
                        onClick: () => setAgentFilledForm(null)
                    }, {
                        text: agencyWay ? t("Agency Information") : t("Counterparty Information")
                    }
                ]}
                noBackButton
            />
            <h2>
                { agencyWay && t("Agency Information") }
                { counterpartyWay && t("Counterparty Information")}
            </h2>
            <div className="paragraph">
                Create a free Happytravel.com account and start booking today
            </div>

            <CachedForm
                id={ FORM_NAMES.RegistrationCompanyForm }
                initialValues={initialValues}
                validationSchema={registrationCompanyValidator}
                onSubmit={submit}
                render={(formik) => (
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
                        { counterpartyWay &&
                            <div className="row">
                                <FieldTextarea
                                    formik={formik}
                                    id="legalAddress"
                                    label={t("Legal Address")}
                                    placeholder={t("Legal Address")}
                                    required
                                />
                            </div>
                        }
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
                        { counterpartyWay &&
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
                                        { value: PAYMENT_METHODS.OFFLINE, text: <>Offline <em>(Bank transfer or cash)</em></> }
                                    ]}
                                />
                            </div>
                        }
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
                            By clicking this button, you agree with{" "}
                            <Link to="/terms" className="link" target="_blank">
                                HappyTravel’s Terms of Use
                            </Link>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default SignUpCompanyForm;
