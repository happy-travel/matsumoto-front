import React from "react";
import { observer } from "mobx-react";
import SettingsHeader from "./parts/settings-header";
import UserInformation from "./parts/user-information";
import UserApplicationSettings from "./parts/user-application-settings";

@observer
class PersonalSettings extends React.Component {
    render() {
        return (
            <div class="settings block">
                <SettingsHeader />
                <section>
                    <UserInformation />
                    <UserApplicationSettings />
                </section>
            </div>
        );
    }
}

export default PersonalSettings;
