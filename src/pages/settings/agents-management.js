import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";

import { dateFormat, PassengerName } from "simple";
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
        cell: (item) => dateFormat.b(item.created * 1000)
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

@observer
class AgentsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
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
            { redirect, agents } = this.state;

        if (redirect)
            return <Redirect push to={redirect} />;

        return (
            <div class="settings block">
                <SettingsHeader />
                <section>
                    <h2><span class="brand">{t("All Agents")}</span></h2>
                    <Table
                        list={agents}
                        columns={agentsColumns(t)}
                        onRowClick={item => this.setState({
                            redirect: `/settings/agents/${item.agentId}`
                        })}
                        textEmptyResult={t("No agents found")}
                        textEmptyList={t("The agents list is empty")}
                    />
                </section>
            </div>
        );
    }
}

export default AgentsManagement;
