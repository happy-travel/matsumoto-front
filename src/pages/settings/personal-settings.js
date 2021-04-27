import React from "react";
import SettingsHeader from "./parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import AgentInformation from "./parts/agent-information";
import AgentApplicationSettings from "./parts/agent-application-settings";

const PersonalSettings = () => (
    <div className="settings block">
        <SettingsHeader />
        <SettingsNav />
        <section>
            <AgentInformation />
            <AgentApplicationSettings />
        </section>
    </div>
);

export default PersonalSettings;
