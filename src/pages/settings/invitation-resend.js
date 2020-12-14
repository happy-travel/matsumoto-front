import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { FieldText } from "components/form";

import { Loader, PassengerName } from "simple";
import { copyToClipboard } from "simple/logic";
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
        this.resend = this.resend.bind(this);
        this.generate = this.generate.bind(this);
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

    resend() {
        var { id } = this.state;

        API.post({
            url: API.AGENT_INVITE_RESEND(id),
            success: () => this.setState({ success: true }),
            error: (error) => {
                this.setState({ success: false });
                Notifications.addNotification(error?.title || error?.detail || error);
            }
        });
    }

    generate() {
        var { invitation, id } = this.state;

        this.setState({
            success: window.location.origin + "/signup/invite/" + invitation.email + "/" + id
        });
    }

    render() {
        var { t } = useTranslation(),
            { invitation } = this.state;

        return (
    <div class="settings block">
        <SettingsHeader />
        <section>
            <h2><span class="brand">{t("Invitation Information")}</span></h2>
            { !invitation ? <Loader /> : <React.Fragment>
                <div class="row">
                    <b>{t("Agent")}</b>:{" "}
                    {PassengerName({ passenger: invitation })}
                </div>
                <div class="row">
                    <b>{t("Position")}</b>:{" "}
                    {invitation.position}
                </div>
                <div class="row">
                    <b>{t("Email")}</b>:{" "}
                    {invitation.email}
                </div>

                { false === this.state.success && <React.Fragment>
                    <div class="row submit-holder">
                        <button onClick={this.resend} class="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                            {t("Resend Invitation")}
                        </button>
                        <button onClick={this.generate} class="button" style={{margin:"0 20px 0 0", paddingLeft: "20px", paddingRight: "20px"}}>
                            {t("Generate Invitation Link")}
                        </button>
                    </div>
                </React.Fragment> }
            </React.Fragment> }

            { this.state.success && <div>
                {this.state.success === true ?
                <div>
                    { this.state.name ?
                        <h3>{t("Your invitation sent to")} {this.state.name}</h3> :
                        <h3>{t("Your invitation sent")}</h3> }
                    <br/>
                </div> :
                <div>
                    <div class="form">
                        <h3>{t("Send this link as an invitation")}</h3>
                        <br/>
                        <FieldText
                            value={this.state.success}
                        />
                    </div>
                    <br/>
                    <button class="button small" onClick={() => copyToClipboard(this.state.success)}>
                        {t("Copy to Clipboard")}
                    </button>
                </div>}
                <Link to="/settings/invitations">
                    <button class="button small payment-back">
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