import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { date } from "simple";
import Table from "components/table";
import SettingsHeader from "./parts/settings-header";
import authStore from "stores/auth-store";

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

@observer
class AgentsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agents: null
        };
    }

    componentDidMount() {
        if (!authStore.activeCounterparty)
            return;

        API.get({
            url: API.AGENCY_AGENTS,
            success: agents => this.setState({ agents })
        });
    }

    render() {
        var { t } = useTranslation(),
            { agents } = this.state;

        return (
            <div className="settings block">
                <SettingsHeader />
                <section>
                    <h2><span className="brand">{t("All Agents")}</span></h2>
                    <div style={{ marginTop: "-105px" }}>
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
    }
}

export default AgentsManagement;
