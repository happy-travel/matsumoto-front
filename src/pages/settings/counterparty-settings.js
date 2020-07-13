import React from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

import { Loader, Flag } from "simple";
import { FieldText, FieldTextarea } from "components/form";
import SettingsHeader from "./parts/settings-header";

import { loadCounterpartyInfo } from "simple/logic/user-settings";

import authStore from "stores/auth-store";

@observer
export default class CounterpartySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        loadCounterpartyInfo(
            () => this.setState({ loading: false })
        );
    }

    render() {
        const { t } = useTranslation();

        return (
        <div class="settings block">
            <SettingsHeader />
            { this.state.loading && <Loader />}
            { !this.state.loading && <section>
                <Formik
                    initialValues={authStore.counterpartyInfo || {}}
                    enableReinitialize={true}
                    onSubmit={() => {}}
                >
                {formik => {
                    var params = {
                        formik: formik,
                        placeholder: t("Not provided"),
                        disabled: true
                    };

                    return (
                    <div class="form">
                        <h2><span class="brand">{t("Payment Information")}</span></h2>
                        <div class="row">
                            <FieldText {...params}
                                       id="name"
                                       label={t("Company Name")}
                            />
                        </div>
                        <div class="row">
                            <FieldText {...params}
                                       id="preferredPaymentMethod"
                                       label={t("Payment method")}
                            />
                            <FieldText {...params}
                                       id="preferredCurrency"
                                       label={t("Currency")}
                            />
                            <FieldText {...params}
                                       id="vatNumber"
                                       label={t("VAT No.")}
                            />
                        </div>

                        <h2><span class="brand">{t("Agency Information")}</span></h2>
                        <div class="row">
                            <FieldText {...params}
                                       id="phone"
                                       label={t("Telephone")}
                            />
                            <FieldText {...params}
                                       id="fax"
                                       label={t("Fax")}
                            />
                        </div>
                        <div class="row">
                            <FieldText {...params}
                                       id="countryName"
                                       label={t("Country")}
                                       addClass={"size-half"}
                                       Flag={<Flag code={formik.values.countryCode} />}
                            />
                            <FieldText {...params}
                                       id="city"
                                       label={t("City")}
                                       addClass={"size-half"}
                            />
                        </div>
                        <div class="row">
                            <FieldText {...params}
                                       id="postalCode"
                                       label={t("Zip/Postal Code")}
                            />
                            <FieldText {...params}
                                       id="website"
                                       label={t("Website")}
                            />
                        </div>
                        <div class="row">
                            <FieldTextarea {...params}
                                id="address"
                                label={t("Address")}
                            />
                        </div>
                    </div>
                    );
                }}
            </Formik>
            </section> }
        </div>
        );
    }
}
