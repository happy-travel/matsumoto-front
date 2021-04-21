import React, { useState, useEffect } from "react";
import { API } from "core";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag, Loader } from "components/simple";
import { FieldText, FieldTextarea } from "components/form";
import SettingsHeader from "pages/settings/parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import VoucherImage from "./parts/voucher-image";
import { loadCounterpartyInfo } from "simple/logic";
import { $personal, $notifications } from "stores";

const CounterpartySettings = observer(() => {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState({});

    useEffect(() => {
        loadCounterpartyInfo(() => setLoading(false));
        API.get({
            url: API.COMPANY_INFO,
            success: setCompany
        });
    }, []);

    const downloadContract = () => {
        API.get({
            url: API.COUNTERPARTY_FILE,
            response: res => {
                if (res.status == 400)
                    $notifications.addNotification("Couldn't get a contract file");
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
    };

    const { t } = useTranslation();

    return (
        <div className="settings block">
            <SettingsHeader />
            <SettingsNav />
            { loading ?
                <Loader /> :
                <section>
                    <Formik
                        initialValues={
                            {
                                ...company,
                                ...$personal.counterpartyInfo
                            } || {}
                        }
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
                        <div className="form">
                            <h2>{t("Legal Information")}</h2>
                            <div className="row">
                                <b>{t("Company Name")}</b>:{" "}
                                {formik.values.name}
                            </div>
                            <div className="row">
                                <b>{t("VAT No.")}</b>
                                &nbsp;
                                {formik.values.vatNumber || t("Not provided")}
                            </div>
                            <div className="row">
                                <b>{t("Payment method")}</b>:{" "}
                                {formik.values.preferredPaymentMethod}
                            </div>

                            {$personal.permitted("ObserveCounterpartyContract") &&
                                <div className="row">
                                    { formik.values.isContractUploaded ?
                                        <button className="button small" onClick={downloadContract}>
                                            Download contract file
                                        </button> :
                                        <span>No Contract Uploaded</span>
                                    }
                                </div>
                            }

                            {($personal.permitted("ObserveChildAgencies") ||
                              $personal.permitted("InviteChildAgencies")) &&
                                <div>
                                    <h2>{t("Child Agencies")}</h2>
                                    <Link to="/settings/child-agencies" className="button" style={{ marginRight: 20 }}>
                                        {t("Observe Child Agencies")}
                                    </Link>
                                    <Link to="/settings/child-agencies/invite" className="button">
                                        {t("Invite Child Agency")}
                                    </Link>
                                </div>
                            }

                            <h2>{t("Agency Information")}</h2>
                            <div className="row">
                                <FieldText
                                    {...params}
                                    id="phone"
                                    label={t("Phone")}
                                />
                                <FieldText
                                    {...params}
                                    id="fax"
                                    label={t("Fax")}
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    {...params}
                                    id="countryName"
                                    label={t("Country")}
                                    className="size-half"
                                    Icon={formik.values.countryCode ? <Flag code={formik.values.countryCode} /> : null}
                                />
                                <FieldText
                                    {...params}
                                    id="city"
                                    label={t("City")}
                                    className="size-half"
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    {...params}
                                    id="postalCode"
                                    label={t("Zip/Postal Code")}
                                />
                                <FieldText
                                    {...params}
                                    id="website"
                                    label={t("Website")}
                                />
                            </div>
                            <div className="row">
                                <FieldTextarea
                                    {...params}
                                    id="address"
                                    label={t("Address")}
                                />
                            </div>
                        </div>
                        );
                    }}
                    </Formik>
                    { $personal.permitted("AgencyImagesManagement") &&
                        <>
                            <h2>{t("Voucher Personalisation")}</h2>
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
                        </>
                    }
                </section>
            }
        </div>
    );
});

export default CounterpartySettings;
