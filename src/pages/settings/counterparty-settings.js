import React from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API } from "core";

import UsersPagesHeader from "components/users-pages-header";
import { FieldText, FieldTextarea } from "components/form";
import { Loader } from "components/simple";

import authStore from "stores/auth-store";

@observer
export default class CounterpartySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            settings: {}
        }
    }

    componentDidMount() {
        API.get({
            url: API.COUNTERPARTY_INFO(authStore.activeCounterparty.id),
            success: settings => this.setState({ settings }),
            after: () => this.setState({ loading: false })
        });
    }

    render() {
        const { t } = useTranslation();

        return <React.Fragment>
            <UsersPagesHeader />
            { this.state.loading && <Loader />}
            { !this.state.loading && <section className="medium-section">
                <Formik
                    initialValues={this.state.settings || {}}
                    enableReinitialize={true}
                    onSubmit={() => {}}
                >
                {formik => {
                    var params = {
                        formik: formik,
                        placeholder: t("Not provided"),
                        disabled: true
                    };

                    return <div className="form">
                        <h2 className="users-pages__title">{t("My account supervisor")}</h2>
                        <div className="row">
                            <FieldText {...params}
                                       id="preferredPaymentMethod"
                                       label={t("Payment method")}
                            />
                            <FieldText {...params}
                                       id="preferredCurrency"
                                       label={t("Currency")}
                            />
                        </div>
                        <div className="row">
                            <FieldText {...params}
                                       id="phone"
                                       label={t("Telephone")}
                            />
                            <FieldText {...params}
                                       id="fax"
                                       label={t("Fax")}
                            />
                        </div>

                        <h2 className="users-pages__title">{t("Voucher personalisation")}</h2>

                        <div className="row">
                            <FieldText {...params}
                                       id="name"
                                       label={t("Company Name")}
                            />
                        </div>
                        <div className="row">
                            <FieldText {...params}
                                       id="countryCode"
                                       label={t("Country Code")}
                            />
                            <FieldText {...params}
                                       id="city"
                                       label={t("City")}
                            />
                        </div>
                        <div className="row">
                            <FieldText {...params}
                                       id="postalCode"
                                       label={t("Zip/Postal Code")}
                            />
                            <FieldText {...params}
                                       id="website"
                                       label={t("Website")}
                            />
                        </div>
                        <div className="row">
                            <FieldTextarea {...params}
                                id="address"
                                label={t("Address")}
                            />
                        </div>
                    </div>;
                }}
            </Formik>
            </section> }
        </React.Fragment>
    }
}
