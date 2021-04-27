import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { API, redirect } from "core";
import { PassengerName } from "simple";
import { Loader } from "components/simple";
import Table from "components/table";
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

const InvitationsManagement = observer(() => {
    const [invitations, setInvitations] = useState(null);

    useEffect(() => {
        if (!$personal.activeCounterparty)
            return;

        API.get({
            url: $personal.permitted("ObserveAgencyInvitations") ?
                API.AGENCY_INVITATIONS :
                API.AGENT_INVITATIONS,
            success: (result) => {
                setInvitations(result);
                if (!result.length)
                    redirect("/settings/invitations/send");
            }
        });
    }, []);

    const { t } = useTranslation();
    return (
        <div className="cabinet block">
            <section>
                { invitations === null ?
                    <Loader /> :
                    <>
                        { !!invitations?.length &&
                            <>
                                <h2>
                                    { $personal.permitted("ObserveAgencyInvitations") ?
                                        t("Unaccepted Agency Invitations") :
                                        t("Unaccepted Invitations")
                                    }
                                </h2>
                                <Table
                                    list={invitations}
                                    columns={invitationsColumns(t)}
                                    textEmptyList={t("There are no available invitations")}
                                    onRowClick={item => redirect(`/settings/agency/invitations/${item.id}`)}
                                />
                            </>
                        }
                        <Link to="/settings/agency/invitations/send">
                            <button className="button" style={{ marginTop: 25 }}>
                                {t("Invite an agent")}
                            </button>
                        </Link>
                    </>
                }
            </section>
        </div>
    );
});

export default InvitationsManagement;
