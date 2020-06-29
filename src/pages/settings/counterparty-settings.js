import React from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API } from "core";

import { Loader } from "simple";
import { FieldText, FieldTextarea } from "components/form";
import SettingsHeader from "./parts/settings-header";

import authStore from "stores/auth-store";

@observer
export default class CounterpartySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            information: null
        }
    }

    componentDidMount() {
        API.get({
            url: API.COUNTERPARTY_INFO(authStore.activeCounterparty.id),
            success: information => this.setState({ information }),
            after: () => this.setState({ loading: false })
        });
    }

    render() {
        const { t } = useTranslation();

        return (
        <div class="settings block">
            <SettingsHeader />
            { this.state.loading && <Loader />}
            { !this.state.loading && <section>
                <Formik
                    initialValues={this.state.information || {}}
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

                        <h2><span class="brand">{t("Counterparty Information")}</span></h2>
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
                                       id="countryCode"
                                       label={t("Country Code")}
                            />
                            <FieldText {...params}
                                       id="city"
                                       label={t("City")}
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
