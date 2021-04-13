import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { Loader, PassengerName } from "simple";
import SettingsHeader from "pages/settings/parts/settings-header";
import authStore from "stores/auth-store";
import Notifications from "stores/notifications-store";

@observer
class InvitationResendPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            id: this.props.match.params.id,
            invitation: null
        };
    }

    componentDidMount() {
        var { id } = this.state;

        if (!authStore.activeCounterparty)
            return;

        var url = API.AGENT_INVITATIONS;
        if (authStore.permitted("ObserveAgencyInvitations"))
            url = API.AGENCY_INVITATIONS;

        API.get({
            url,
            success: invitations => this.setState({
                invitation: invitations.filter(item => item.id == id)[0]
            })
        });
    }

    resend = () => {
        var { id } = this.state;

        API.post({
            url: API.AGENT_INVITE_RESEND(id),
            success: () => this.setState({ success: true }),
        });
    };

    disable = () => {
        var { id } = this.state;

        API.post({
            url: API.AGENT_INVITE_DISABLE(id),
            success: () => redirect("/settings/invitations")
        });
    };

    render() {
        var { t } = useTranslation(),
            { invitation } = this.state;

        return (
    <div className="settings block">
        <SettingsHeader />
        <section>
            <h2><span className="brand">{t("Invitation Information")}</span></h2>
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

                { false === this.state.success && <>
                    {"Active" == invitation.status &&
                        <div className="row">
                            { !invitation.isExpired &&
                                <button onClick={this.disable} className="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                                    {t("Disable Invitation")}
                                </button>
                            }
                            <button onClick={this.resend} className="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                                {t("Resend Invitation")}
                            </button>
                        </div>
                    }
                </> }
            </> }

            { this.state.success && <div>
                <div>
                    { this.state.name ?
                        <h3>{t("Your invitation sent to")} {this.state.name}</h3> :
                        <h3>{t("Your invitation sent")}</h3> }
                    <br/>
                </div>
                <Link to="/settings/invitations">
                    <button className="button small payment-back">
                        {t("Back to Invitations")}
                    </button>
                </Link>
            </div> }
        </section>
    </div>
        );
    }
}

export default InvitationResendPage;