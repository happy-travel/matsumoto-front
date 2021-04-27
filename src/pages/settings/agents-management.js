import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { date } from "simple";
import Table from "components/table";
import SettingsHeader from "pages/settings/parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import { $personal } from "stores";

const agentsColumns = t => [
    {
        header: t("Name"),
        cell: "name",
    },
    {
        header: "Sign Up Date",
        cell: (item) => date.format.c(item.created * 1000)
    },
    {
        header: "Status",
        cell: (item) => item.isActive ? "Active" : "Inactive"
    },
    {
        header: "Markup",
        cell: (item) => item.markupSettings || "None"
    }
];

export const Searches = v => [
    v.name
];

const AgentsManagement = observer(() => {
    const [agents, setAgents] = useState(null);

    useEffect(() => {
        if (!$personal.activeCounterparty)
            return;

        API.get({
            url: API.AGENCY_AGENTS,
            success: setAgents
        });
    }, [$personal.activeCounterparty]);

    const { t } = useTranslation();

    return (
        <div className="settings block">
            <SettingsHeader />
            <SettingsNav />
            <section>
                <h2>{t("All Agents")}</h2>
                <div style={{ marginTop: "-126px" }}>
                    <Table
                        list={agents}
                        columns={agentsColumns(t)}
                        onRowClick={item => redirect(`/settings/agents/${item.agentId}`)}
                        textEmptyResult={t("No agents found")}
                        textEmptyList={t("The agents list is empty")}
                        searches={Searches}
                    />
                </div>
            </section>
        </div>
    );
});

export default AgentsManagement;
