import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import { API } from "core";

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
            success: invitations => this.setState({ invitations })
        });
    }

    render() {
        var { t } = useTranslation(),
            { redirect, invitations } = this.state;

        if (redirect)
            return <Redirect push to={redirect} />;

        return (
            <div class="settings block">
                <SettingsHeader />
                <section>
                    {invitations === null ?
                        <Loader /> :
                        <React.Fragment>
                            {!!invitations?.length &&
                                <React.Fragment>
                                    <h2><span class="brand">{
                                        authStore.permitted("ObserveAgencyInvitations") ?
                                        t("Unaccepted Agency Invitations") :
                                        t("Unaccepted Invitations")
                                    }</span></h2>
                                    <Table
                                        list={invitations}
                                        columns={invitationsColumns(t)}
                                        textEmptyList={t("There are no available invitations")}
                                    />
                                </React.Fragment>
                            }
                            <Link to="/settings/invite">
                                <button class="button payment-back">
                                    {t("Invite an agent")}
                                </button>
                            </Link>
                        </React.Fragment>
                    }
                </section>
            </div>
        );
    }
}

export default InvitationsManagement;
