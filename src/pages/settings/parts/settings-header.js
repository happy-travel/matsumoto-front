import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { price } from "simple";
import { API } from "core";
import { $personal } from "stores";

const SettingsHeader = observer(() => {
    useEffect(() => {
        if ($personal.permitted("ObserveBalance"))
            API.get({
                url: API.ACCOUNT_BALANCE("USD"),
                success: (value) => $personal.setBalance(value)
            });
    }, []);

    const { t } = useTranslation();
    return (
        <div className="settings-header">
            <section>
                <div className="agent">
                    <div className="photo">
                        <div className="no-avatar" />
                    </div>
                    <div className="data">
                        <h1>{$personal.information?.firstName} {$personal.information?.lastName}</h1>
                        <div className="company">
                            {$personal.activeCounterparty.name} (
                                {$personal.activeCounterparty.counterpartyState?.replace(/([A-Z])/g, " $1").trim()}
                            ) <b className={"status " + $personal.activeCounterparty.counterpartyState} />
                        </div>
                        { $personal.permitted("ObserveBalance") &&
                            <div>
                                {t("Balance")}:{" "}
                                <span>{price($personal.balance?.currency, $personal.balance?.balance)}</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="logout-wrapper">
                    <Link to="/logout" className="button">
                        <i className="icon icon-logout" />
                        {t("Log out")}
                    </Link>
                </div>
            </section>
            <div className="settings-nav">
                <section>
                    <NavLink exact to="/settings">
                        {t("Personal Settings")}
                    </NavLink>
                    <NavLink to="/settings/counterparty">
                        {t("Agency Information")}
                    </NavLink>
                    {$personal.permitted("ObserveAgents") &&
                        <NavLink to="/settings/agents">
                            {t("Agent Management")}
                        </NavLink>
                    }
                    {$personal.permitted("AgentInvitation") &&
                        <NavLink to="/settings/invitations" >
                            {t("Invitations")}
                        </NavLink>
                    }
                    { $personal.permitted("ObservePaymentHistory") &&
                        <NavLink to="/settings/account">
                            {t("Account statement")}
                        </NavLink>
                    }
                </section>
            </div>
        </div>
    );
});

export default SettingsHeader;
