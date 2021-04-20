import React from "react";
import { observer } from "mobx-react";
import SettingsHeader from "./parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import AgentInformation from "./parts/agent-information";
import AgentApplicationSettings from "./parts/agent-application-settings";

@observer
class PersonalSettings extends React.Component {
    render() {
        return (
            <div className="settings block">
                <SettingsHeader />
                <SettingsNav />
                <section>
                    <AgentInformation />
                    <AgentApplicationSettings />
                </section>
            </div>
        );
    }
}

export default PersonalSettings;
