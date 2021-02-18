import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { price } from "simple";
import { API } from "core";
import authStore from "stores/auth-store";

@observer
class SettingsHeader extends React.Component {
    componentDidMount() {
        if (authStore.permitted("ObserveBalance"))
            API.get({
                url: API.ACCOUNT_BALANCE("USD"),
                success: balance => authStore.setBalance(balance)
            });
    }

    render() {
        const { t } = useTranslation();

        return (
            <div className="settings-header">
                <section>
                    <div className="logout-wrapper">
                        <Link to="/logout" className="button transparent-with-border">
                            <i className="icon icon-logout" />
                            {t("Log out")}
                        </Link>
                    </div>
                    <div className="user">
                        <div className="photo">
                            <div className="no-avatar" />
                        </div>
                        <div className="data">
                            <h1>{authStore.user?.firstName} {authStore.user?.lastName}</h1>
                            <h3>
                                <div className={"status " + authStore.activeCounterparty.counterpartyState} />
                                {authStore.activeCounterparty.name} (
                                    {authStore.activeCounterparty.counterpartyState?.replace(/([A-Z])/g, " $1").trim()}
                                )
                            </h3>
                            { authStore.permitted("ObserveBalance") &&
                                <div className="balance">
                                    <div><i className="icon icon-wallet"/></div>
                                    <span className="text">
                                        {t("Balance")}: {price(authStore.balance?.currency, authStore.balance?.balance)}
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                </section>
                <div>
                    <NavLink exact to="/settings">
                        {t("Personal Settings")}
                    </NavLink>
                    <NavLink to="/settings/counterparty">
                        {t("Agency Information")}
                    </NavLink>
                    {authStore.permitted("ObserveAgents") &&
                        <NavLink to="/settings/agents">
                            {t("Agent Management")}
                        </NavLink>
                    }
                    {authStore.permitted("AgentInvitation") &&
                        <NavLink to="/settings/invitations" >
                            {t("Invitations")}
                        </NavLink>
                    }
                    { authStore.permitted("ObservePaymentHistory") &&
                        <NavLink to="/settings/account">
                            {t("Account statement")}
                        </NavLink>
                    }
                </div>
            </div>
        );
    }
}

export default SettingsHeader;