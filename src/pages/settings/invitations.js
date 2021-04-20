import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { API, redirect } from "core";
import { PassengerName } from "simple";
import { Loader } from "components/simple";
import Table from "components/table";
import SettingsHeader from "./parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import { $personal } from "stores";

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
    state = {
        redirect: null,
        invitations: null,
        creation: false
    };

    componentDidMount() {
        if (!$personal.activeCounterparty)
            return;

        var url = API.AGENT_INVITATIONS;
        if ($personal.permitted("ObserveAgencyInvitations"))
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
                <SettingsNav />
                <section>
                    {invitations === null ?
                        <Loader /> :
                        <>
                            {!!invitations?.length &&
                                <>
                                    <h2>{
                                        $personal.permitted("ObserveAgencyInvitations") ?
                                        t("Unaccepted Agency Invitations") :
                                        t("Unaccepted Invitations")
                                    }</h2>
                                    <Table
                                        list={invitations}
                                        columns={invitationsColumns(t)}
                                        textEmptyList={t("There are no available invitations")}
                                        onRowClick={item => redirect(`/settings/invitations/${item.id}`)}
                                    />
                                </>
                            }
                            <Link to="/settings/invitations/send">
                                <button className="button" style={{ marginTop: 25 }}>
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
