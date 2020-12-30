import React from "react";
import { API } from "core";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

import { Loader, Flag } from "simple";
import { FieldText, FieldTextarea } from "components/form";
import SettingsHeader from "./parts/settings-header";
import VoucherImage from "./parts/voucher-image";

import { loadCounterpartyInfo } from "simple/logic";

import authStore from "stores/auth-store";
import Notifications from "stores/notifications-store";

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

    downloadContract() {
        API.get({
            url: API.COUNTERPARTY_FILE,
            response: res => {
                if (res.status == 400)
                    Notifications.addNotification("Couldn't get a contract file");
                if (res.status == 200)
                    res.blob().then(blobby => {
                        var anchor = document.createElement("a");
                        document.body.appendChild(anchor);

                        var objectUrl = window.URL.createObjectURL(blobby);
                        anchor.href = objectUrl;
                        anchor.download = 'contract.pdf';
                        anchor.click();

                        window.URL.revokeObjectURL(objectUrl);
                    });
            }
        })
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
                        <h2><span class="brand">{t("Legal Information")}</span></h2>
                        <div class="row">
                            <b>{t("Company Name")}</b>:{" "}
                            {formik.values.name}
                        </div>
                        <div class="row">
                            <b>{t("VAT No.")}</b>
                            &nbsp;
                            {formik.values.vatNumber || t("Not provided")}
                        </div>
                        <div class="row">
                            <b>{t("Payment method")}</b>:{" "}
                            {formik.values.preferredPaymentMethod}
                        </div>

                        {authStore.permitted("ObserveCounterpartyContract") &&
                            <div class="row">
                                <button class="button small" onClick={this.downloadContract}>
                                    Download contract file
                                </button>
                            </div>
                        }

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
                <h2><span class="brand">{t("Voucher Personalisation")}</span></h2>
                <div>
                    <VoucherImage
                        route={API.AGENCY_LOGO}
                        title={t("Logo")}
                        text="Recommended size: 226 x 114 pixels"
                    />
                    <VoucherImage
                        route={API.AGENCY_BANNER}
                        title={t("Banner")}
                        text="Recommended size: 726 x 111 pixels"
                    />
                </div>
            </section> }
        </div>
        );
    }
}
