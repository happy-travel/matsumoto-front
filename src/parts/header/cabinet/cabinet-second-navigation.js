import React from "react";
import { observer } from "mobx-react";
import { NavLink, Route, Switch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { $personal } from "stores";

const CabinetSecondNavigation = observer(() => {
    const { t } = useTranslation();
    return (
        <Switch>
            <Route path="/settings/account" component={null} />
            <Route path="/settings/child-agencies" component={null} />
            <Route path="/settings/agency" component={() => (
                <div className="navigation cabinet-second-navigation"><section><nav>
                    <li><NavLink exact to="/settings/agency">{t("Legal Information")}</NavLink></li>
                    { $personal.permitted("ObserveAgents") &&
                        <li><NavLink to="/settings/agency/agents">{t("Agents Management")}</NavLink></li>
                    }
                    { $personal.permitted("AgentInvitation") &&
                        <li><NavLink to="/settings/agency/invitations">{t("Invitations")}</NavLink></li>
                    }
                    { $personal.permitted("AgencyImagesManagement") &&
                        <li><NavLink to="/settings/agency/voucher">{t("Voucher Personalisation")}</NavLink></li>
                    }
                </nav></section></div>
            )} />
            <Route component={() => (
                <div className="navigation cabinet-second-navigation"><section><nav>
                    <li><NavLink exact to="/settings/agent">{t("Application Settings")}</NavLink></li>
                    <li><NavLink to="/settings/agent/personal">{t("Personal Information")}</NavLink></li>
                </nav></section></div>
            )} />
        </Switch>
    );
});

export default CabinetSecondNavigation;
