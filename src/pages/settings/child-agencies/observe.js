import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { price, date } from "simple";
import Table from "components/table";
import Breadcrumbs from "components/breadcrumbs";
import { $personal } from "stores";

const childAgenciesColumns = t => [
    {
        header: t("Name"),
        cell: "name"
    },
    {
        header: t("Active"),
        cell: v => v.isActive ? t("Yes") : t("No")
    },
    {
        header: t("Balance"),
        cell: v => price(v.accountBalance)
    },
    {
        header: t("Created"),
        cell: v => date.format.c(v.created)
    }
];

export const Searches = v => [
    v.name,
    v.id,
];

@observer
class ChildAgencyObservePage extends React.Component {
    state = {
        agencies: null
    };

    componentDidMount() {
        if (!$personal.activeCounterparty)
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
                    <h2>{t("Child Agencies")}</h2>
                    <div style={{ marginTop: "-117px" }}>
                        <Table
                            list={agencies}
                            columns={childAgenciesColumns(t)}
                            onRowClick={item => redirect(`/settings/child-agencies/${item.id}`)}
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
