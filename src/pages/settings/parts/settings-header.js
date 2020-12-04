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
            <div class="settings-header">
                <section>
                    <div class="logout-wrapper">
                        <Link to="/logout" class="button transparent-with-border">
                            <i class="icon icon-logout" />
                            {t("Log out")}
                        </Link>
                    </div>
                    <div class="user">
                        <div class="photo">
                            <div class="no-avatar" />
                        </div>
                        <div class="data">
                            <h1>{authStore.user?.firstName} {authStore.user?.lastName}</h1>
                            <h3>
                                <div class={"status " + authStore.activeCounterparty.counterpartyState} />
                                {authStore.activeCounterparty.name} (
                                    {authStore.activeCounterparty.counterpartyState?.replace(/([A-Z])/g, " $1").trim()}
                                )
                            </h3>
                            { authStore.permitted("ObserveBalance") &&
                                <div class="balance">
                                    <div><i class="icon icon-wallet"/></div>
                                    <span class="text">
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