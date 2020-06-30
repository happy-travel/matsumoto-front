import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

import authStore from "stores/auth-store";

@observer
class SettingsHeader extends React.Component {
    render() {
        const { t } = useTranslation();

        return <div class="settings-header">
            <section>
                <h1>{authStore.activeCounterparty.name}</h1>
            </section>
            <div>
                <NavLink to="/settings/personal" activeClassName="active">
                    {t("Personal Settings")}
                </NavLink>
                <NavLink to="/settings/counterparty">
                    {t("Counterparty Information")}
                </NavLink>
                <NavLink to="/settings/agents">
                    {t("Agent Management")}
                </NavLink>
            </div>
        </div>;
    }
}

export default SettingsHeader;