import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { PassengerName } from "simple";
import { Loader } from "components/simple";
import { $personal } from "stores";

const InvitationResendPage = ({ match }) => {
    const [success, setSuccess] = useState(false);
    const [invitation, setInvitation] = useState(false);
    const id = match.params.id;

    useEffect(() => {
        if (!$personal.activeCounterparty)
            return;

        API.get({
            url: $personal.permitted("ObserveAgencyInvitations") ?
                API.AGENCY_INVITATIONS :
                API.AGENT_INVITATIONS,
            success: (result) => setInvitation(result.filter(item => item.id == id)[0])
        });
    }, []);

    const resend = () => {
        API.post({
            url: API.AGENT_INVITE_RESEND(id),
            success: () => setSuccess(true),
            error: () => setSuccess(false)
        });
    };

    const disable = () => {
        API.post({
            url: API.AGENT_INVITE_DISABLE(id),
            success: () => redirect("/settings/invitations")
        });
    };

    const { t } = useTranslation();

    return (
    <div className="cabinet block">

        <section>
            <h2>{t("Invitation Information")}</h2>
            { !invitation ? <Loader /> : <>
                <div className="row">
                    <b>{t("Agent")}</b>:{" "}
                    {PassengerName({ passenger: invitation })}
                </div>
                <div className="row">
                    <b>{t("Position")}</b>:{" "}
                    {invitation.position}
                </div>
                <div className="row">
                    <b>{t("Email")}</b>:{" "}
                    {invitation.email}
                </div>
                <div className="row">
                    <b>{t("Status")}</b>:{" "}
                    {invitation.status}
                </div>
                <div className="row">
                    <b>{t("Inviter")}</b>:{" "}
                    {invitation.createdBy}
                </div>
                <div className="row">
                    <b>{t("Created")}</b>:{" "}
                    {invitation.created} {invitation.isExpired && `(${t("Expired")})`}
                </div>

                { false === success && <>
                    {"Active" == invitation.status &&
                        <div className="row">
                            { !invitation.isExpired &&
                                <button onClick={disable} className="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                                    {t("Disable Invitation")}
                                </button>
                            }
                            <button onClick={resend} className="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                                {t("Resend Invitation")}
                            </button>
                        </div>
                    }
                </> }
            </> }

            { success && <div>
                <div>
                    <h3>{t("Invitation sent")}</h3>
                    <br/>
                </div>
                <Link to="/settings/invitations">
                    <button className="button small">
                        {t("Back to") + " " + t("Invitations")}
                    </button>
                </Link>
            </div> }
        </section>
    </div>
    );
};

export default InvitationResendPage;