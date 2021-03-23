import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import Table from "components/table";
import authStore from "stores/auth-store";
import Breadcrumbs from "components/breadcrumbs";

const childAgenciesColumns = t => [
    {
        header: t("Name"),
        cell: "name",
    },
    {
        header: "Counterparty ID",
        cell: "counterpartyId"
    }
];

export const Searches = v => [
    v.name,
    v.id,
];

@observer
class ChildAgencyObservePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agencies: null
        };
    }

    componentDidMount() {
        if (!authStore.activeCounterparty)
            return;

        API.get({
            url: API.CHILD_AGENCIES,
            success: agencies => this.setState({ agencies })
        });
    }

    render() {
        var { t } = useTranslation(),
            { agencies } = this.state;

        return (
            <div className="settings block">
                <section>
                    <Breadcrumbs items={[
                        {
                            text: t("Agency"),
                            link: "/settings/counterparty"
                        },
                        {
                            text: t("Child Agencies")
                        }
                    ]}/>
                    <h2><span className="brand">{t("All Child Agencies")}</span></h2>
                    <div style={{ marginTop: "-105px" }}>
                        <Table
                            list={agencies}
                            columns={childAgenciesColumns(t)}
                            onRowClick={item => redirect(`/settings/child-agencies/${item.agentId}`)}
                            textEmptyResult={t("No child agencies found")}
                            textEmptyList={t("Child agencies list is empty")}
                            searches={Searches}
                        />
                    </div>
                    <Link to="/settings/child-agencies/invite" className="button" style={{ marginTop: 40 }}>
                        {t("Invite Child Agency")}
                    </Link>
                </section>
            </div>
        );
    }
}

export default ChildAgencyObservePage;
