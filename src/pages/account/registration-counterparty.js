import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect, Link } from "react-router-dom";
import { API } from "core";
import { userAuthSetToStorage } from "core/auth";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import {
    CachedForm,
    FORM_NAMES,
    FieldText,
    FieldTextarea,
    FieldSelect
} from "components/form";
import { registrationCounterpartyValidator } from "components/form/validation";
import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";

import store from "stores/auth-store";
import UI from "stores/ui-store";
import View from "stores/view-store";

@observer
class RegistrationCounterparty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToIndexPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        store.setRegistrationCounterpartyForm(values);

        API.post({
            url: API.USER_REGISTRATION_M,
            body: store.registration,
            success: () => {
                API.get({
                    url: API.USER,
                    success: (user) => {
                        if (user?.email)
                            store.setUser(user);
                        userAuthSetToStorage(user);
                    }
                });
                store.setRegistrationUserForm({});
                store.setRegistrationCounterpartyForm({});
                this.setState({ redirectToIndexPage: true });

                UI.dropFormCache(FORM_NAMES.RegistrationStepTwoForm);
                UI.dropFormCache(FORM_NAMES.RegistrationStepThreeForm);
            },
            error: (error) => {
                View.setTopAlertText(error?.title || error?.detail);
                if (error && !(error?.title || error?.detail))
                    this.setState({ redirectToIndexPage: true });
            }
        });
    }

    setCountryValue(country, formik, connected) {
        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(connected+"Code", country.code);
        View.setCountries([]);
    }

    render() {
        var { t } = useTranslation();

        if (this.state.redirectToIndexPage)
            return <Redirect push to="/" />;

        return (
            <div class="account block sign-up-page">
                <div class="hide">
                    {'' + View.countries}
                </div>
                <section>
                    <div class="logo-wrapper">
                        <div class="logo" />
                    </div>
                    <div class="middle-section">
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
                            items={[t("Log In Information"), t("Agent Information"), t("Company Information")]}
                            current={2}
                            addClass="action-steps-another-bg"
                        />
                        <h1>
                            Company Information
                        </h1>
                        <p>
                            Create a free HappyTravel.com account and start booking today.<br/>
                            Already have an account? <Link to="/logout" class="link">Log In Here.</Link>
                        </p>

                        <CachedForm
                            id={ FORM_NAMES.RegistrationStepThreeForm }
                            initialValues={{
                                "name": "",
                                "address": "",
                                "country": "",
                                "countryCode": "",
                                "city": "",
                                "phone": "",
                                "fax": "",
                                "preferredCurrency": "USD",
                                "preferredPaymentMethod": "",
                                "website": "",
                                "postalCode": ""
                            }}
                            validationSchema={registrationCounterpartyValidator}
                            onSubmit={this.submit}
                            render={formik => (
                                <React.Fragment>
                                    <div class="form">
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="name"
                                                       label={t("Company Name")}
                                                       placeholder={t("Company Name")}
                                                       required
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldTextarea formik={formik}
                                                           id="address"
                                                           label={t("Company Address")}
                                                           placeholder={t("Company Address")}
                                                           required
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id={"postalCode"}
                                                       label={t("Zip/Postal Code")}
                                                       placeholder={t("Zip/Postal Code")}
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="country"
                                                       additionalFieldForValidation="countryCode"
                                                       label={t("Country")}
                                                       placeholder={t("Country")}
                                                       Dropdown={RegionDropdown}
                                                       onChange={regionInputChanged}
                                                       options={View.countries}
                                                       setValue={this.setCountryValue}
                                                       required
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="city"
                                                       label={t("City")}
                                                       placeholder={t("City")}
                                                       required
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldSelect formik={formik}
                                                         id="preferredPaymentMethod"
                                                         label={t("Preferred Payment Method")}
                                                         required
                                                         placeholder={t("Preferred Payment Method")}
                                                         options={[
                                                             { value: "BankTransfer", text: "Bank transfer"},
                                                             { value: "CreditCard", text: "Credit card"}
                                                         ]}
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldSelect formik={formik}
                                                         id="preferredCurrency"
                                                         label={t("Company account currency")}
                                                         required
                                                         placeholder={t("Company account currency")}
                                                         options={[
                                                             { value: "USD", text: "US Dollars"}
                                                         ]}
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="phone"
                                                       label={t("Telephone")}
                                                       placeholder={t("Telephone")}
                                                       required
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="fax"
                                                       label={t("Fax")}
                                                       placeholder={t("Fax")}
                                            />
                                        </div>
                                        <div class="row">
                                            <FieldText formik={formik}
                                                       id="website"
                                                       label={t("Website")}
                                                       placeholder={t("Website")}
                                            />
                                        </div>
                                        <div class="row submit-holder">
                                            <div class="field">
                                                <div class="inner">
                                                    <button type="submit" class={"button" + __class(!formik.isValid, "disabled")}>
                                                        {t("Get started")}
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="field terms">
                                                By clicking this button, you agree with <Link to="/terms" class="link">HappyTravel’s Terms of Use.</Link>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        />
                    </div>
                </section>
            </div>
        );
    }
}

export default RegistrationCounterparty;
