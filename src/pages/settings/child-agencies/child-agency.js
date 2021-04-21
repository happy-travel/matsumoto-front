import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";
import { Loader } from "components/simple";
import Breadcrumbs from "components/breadcrumbs";
import Markups from "parts/markups/markups";
import ChildAgencyTransferBalancePart from "./parts/transfer-balance";

const ChildAgencyPage = ({ match }) => {
    const { id } = match.params;
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState({});
    const [agency, setAgency] = useState({});

    const refresh = async () => {
        await Promise.all([
            API.get({
                url: API.AGENCY_ACCOUNTS,
                success: setAccounts
            }),
            API.get({
                url: API.CHILD_AGENCY(id),
                success: setAgency
            })
        ]);
        setLoading(false);
    };

    useEffect(refresh, []);

    const activate = () => {
        API.post({
            url: API.CHILD_AGENCY_ACTIVATE(id),
            success: () => setAgency({
                ...agency,
                isActive: true
            })
        });
    };

    const deactivate = () => {
        API.post({
            url: API.CHILD_AGENCY_DEACTIVATE(id),
            success: () => setAgency({
                ...agency,
                isActive: false
            })
        });
    };

    const { t } = useTranslation();

    return (
        <div className="settings block">
            <section>
                { loading ?
                    <Loader /> :
                    <>
                        <Breadcrumbs
                            items={[
                                {
                                    text: t("Agency"),
                                    link: "/settings/counterparty"
                                },
                                {
                                    text: t("Child Agencies"),
                                    link: "/settings/child-agencies"
                                }, {
                                    text: agency.name
                                }
                            ]}
                            noBackButton
                        />

                        <h2>{t("Information")}</h2>
                        <div className="row">
                            <b>{t("Agency")}</b>: {agency.name}
                        </div>
                        <div className="row">
                            <b>{t("Status")}</b>:{" "}
                            {agency.isActive ? "Active" : "Inactive"}
                        </div>
                        <div className="row">
                            <b>{t("Created")}</b>:{" "}
                            {date.format.c(agency.created)}
                        </div>

                        <div>
                            {!agency.isActive ?
                                <button
                                    className="button"
                                    onClick={activate}
                                >
                                    {t("Activate agency")}
                                </button> :
                                <button
                                    className="button"
                                    onClick={deactivate}
                                >
                                    {t("Deactivate agency")}
                                </button>
                            }
                        </div>

                        { agency.isActive &&
                            <>
                                <ChildAgencyTransferBalancePart
                                    payer={accounts}
                                    recipient={agency.accounts}
                                    onUpdate={refresh}
                                />
                                <Markups
                                    id={agency.id}
                                    emptyText={"Agency has no markups"}
                                    markupsRoute={API.CHILD_AGENCY_MARKUPS}
                                    markupRoute={API.CHILD_AGENCY_MARKUP}
                                />
                            </>
                        }
                    </>
                }
            </section>
        </div>
    );
};

export default ChildAgencyPage;