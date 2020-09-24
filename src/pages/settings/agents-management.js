import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Link } from 'react-router-dom';
import { API } from "core";

import { dateFormat, Loader } from "simple";
import Table from "components/external/table";
import SettingsHeader from "./parts/settings-header";

import authStore from "stores/auth-store";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Sign Up Date',
        accessor: 'created',
        Cell: (item) => dateFormat.b(item.cell.value * 1000)
    },
    {
        Header: 'Markup',
        accessor: 'markupSettings',
        Cell: (item) => item.cell.value || '–'
    },
    {
        Header: 'Actions',
        accessor: 'agentId',
        Cell: (item) => {
            const { id, agencyId } = authStore.activeCounterparty;
            return <Link
                to={`/settings/agents/${item.cell.value}/${id}/${agencyId}`}
            ><span class={`icon icon-action-pen-orange`}/></Link>;
        }
    },
];

@observer
class AgentsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allAgents: null,
            filteredAgents: null,
            agentsTablePageInfo: {
                pageIndex: 0,
                pageSize: 10
            }
        };
        this.loadAgents = this.loadAgents.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    componentDidMount() {
        this.loadAgents();
    }
    
    applyFilter(values) {
        var value = values?.text?.trim().replace(/\n/g, ''),
            agents = this.state.allAgents || [];
        this.setState({
            filteredAgents:
                (!value?.length)
                    ? agents || []
                    : agents.filter(agent =>
                        agent.name.toLowerCase().includes(value.toLowerCase()))
        });
    }

    loadAgents() {
        if (authStore.activeCounterparty) {
            const { agencyId } = authStore.activeCounterparty;
            API.get({
                url: API.AGENCY_AGENTS(agencyId),
                success: result => this.setState({
                    allAgents: result,
                    filteredAgents: result || []
                }),
                after: () => this.setState({
                    loading: false
                })
            });
            return;
        }
        this.setState({
            loading: false
        });
    }

    render() {
        const { t } = useTranslation();

        return (
        <div class="settings block">
            <SettingsHeader />
            {this.state.loading ?
                <Loader /> :
                <section>
                    { authStore.activeCounterparty.inAgencyPermissions?.indexOf("AgentInvitation") != -1 &&
                        <Link to="/settings/invite" class="item">
                            <button class="button small" style={{ float: "right" }}>
                                {t("Send invitation")}
                            </button>
                        </Link>
                        // todo: temporary
                    }
                    <div>
                        <h2><span class="brand">{t("All Agents")}</span></h2>
                    </div>
                    { this.state.allAgents === null && <h3>
                        {t("Nothing to show")}
                    </h3> }
                    { this.state.filteredAgents?.length === 0 && <h3>
                        {t("List is empty")}
                    </h3> }
                    { !!this.state.filteredAgents?.length && <Table
                        data={this.state.filteredAgents}
                        count={this.state.filteredAgents.length}
                        fetchData={this.loadAgents}
                        columns={columns}
                        {...this.state.agentsTablePageInfo}
                        manualPagination
                    /> }
                </section>
            }
        </div>
        );
    }
}

export default AgentsManagement;
