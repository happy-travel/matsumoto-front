import React, { useState, useEffect } from "react";
import { API } from "core";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag, Loader } from "components/simple";
import { FieldText, FieldTextarea } from "components/form";
import { loadCounterpartyInfo } from "simple/logic";
import { $personal, $notifications } from "stores";

const AgencyLegalInformation = observer(() => {
    const [loading, setLoading] = useState(true);
    const [agency, setAgency] = useState({});

    useEffect(() => {
        loadCounterpartyInfo(() => setLoading(false));
        API.get({
            url: API.AGENCY,
            success: setAgency
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
                        let anchor = document.createElement("a");
                        document.body.appendChild(anchor);

                        const objectUrl = window.URL.createObjectURL(blobby);
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
        <div className="cabinet block">
            { loading ?
                <Loader /> :
                <section>
                    <Formik
                        initialValues={
                            {
                                ...agency,
                                ...$personal.counterpartyInfo
                            } || {}
                        }
                        enableReinitialize
                        onSubmit={() => {}}
                    >
                    {formik => {
                        const params = {
                            formik: formik,
                            placeholder: t("Not provided"),
                            disabled: true
                        };

                        return (
                        <div className="form">
                            <h2>{t("Legal Information")}</h2>
                            <div className="row">
                                <b>{t("Agency Name")}</b>:{" "}
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
                </section>
            }
        </div>
    );
});

export default AgencyLegalInformation;
