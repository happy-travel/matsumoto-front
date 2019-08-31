import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import { localStorage } from "core";
import Authorize from "core/auth/authorize";

import { ReactComponent as NoAvatar } from "./images/no-avatar.svg";

const dropdownId = "UserMenuDropdown";

@observer
class UserMenuDropdown extends React.Component {
    toggleMenu() {
        if (dropdownId == UI.openDropdown)
            return UI.setOpenDropdown(null);
        UI.setOpenDropdown(dropdownId);
    }

    render() {
        const { t } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher user-switcher" onClick={this.toggleMenu}>
                    <div class="avatar">
                        <NoAvatar />
                    </div>
                    <div class="double">
                        <div class="name">{UI.user?.firstName || "Account"} {UI.user?.lastName}</div> {/* todo: non-registered layout */}
                        <div class="company">{UI.user?.position}</div>
                    </div>
                    <div class="switch-arrow" />
                    {dropdownId == UI.openDropdown && <div class="user-menu dropdown">
                        <div class="item" onClick={() => Authorize.signoutRedirect()}>
                            {t("Log out")}
                        </div>
                    </div>}
                </div>
            </React.Fragment>
        );
    }
}

export default UserMenuDropdown;
