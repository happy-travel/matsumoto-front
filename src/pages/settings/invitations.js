import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { API, redirect } from "core";
import { PassengerName, Loader } from "simple";
import Table from "components/table";
import SettingsHeader from "./parts/settings-header";
import authStore from "stores/auth-store";

const invitationsColumns = t => [
    {
        header: "Email",
        cell: "email"
    },
    {
        header: t("Name"),
        cell: (passenger) => PassengerName({ passenger })
    },
    {
        header: "Position",
        cell: "position"
    },
    {
        header: "Inviter",
        cell: "createdBy"
    },
    {
        header: "Created",
        cell: "created"
    }
];

@observer
class InvitationsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            invitations: null,
            creation: false
        };
    }

    componentDidMount() {
        if (!authStore.activeCounterparty)
            return;

        var url = API.AGENT_INVITATIONS;
        if (authStore.permitted("ObserveAgencyInvitations"))
            url = API.AGENCY_INVITATIONS;

        API.get({
            url,
            success: invitations => this.setState({
                invitations,
                redirect: invitations.length ? null : '/settings/invitations/send'
            })
        });
    }

    render() {
        var { t } = useTranslation(),
            { invitations } = this.state;

        return (
            <div className="settings block">
                <SettingsHeader />
                <section>
                    {invitations === null ?
                        <Loader /> :
                        <>
                            {!!invitations?.length &&
                                <>
                                    <h2><span className="brand">{
                                        authStore.permitted("ObserveAgencyInvitations") ?
                                        t("Unaccepted Agency Invitations") :
                                        t("Unaccepted Invitations")
                                    }</span></h2>
                                    <Table
                                        list={invitations}
                                        columns={invitationsColumns(t)}
                                        textEmptyList={t("There are no available invitations")}
                                        onRowClick={item => redirect(`/settings/invitations/${item.id}`)}
                                    />
                                </>
                            }
                            <Link to="/settings/invitations/send">
                                <button className="button payment-back">
                                    {t("Invite an agent")}
                                </button>
                            </Link>
                        </>
                    }
                </section>
            </div>
        );
    }
}

export default InvitationsManagement;
