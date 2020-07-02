import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

import authStore from "stores/auth-store";
import View from "stores/view-store";

const dropdownId = "UserMenuDropdown",
      calcTitleFor = (value) => (value?.length > 14 ? { title: value } : {});

@observer
class UserMenuDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        const { t } = useTranslation();

        return (
            <div class="switcher user-switcher"
                 data-dropdown={dropdownId}
                 onClick={() => View.setOpenDropdown(dropdownId)}>
                <div class="avatar" />
                <div class="double">
                    <div class="name" {...calcTitleFor(authStore.user?.firstName + authStore.user?.lastName)}>{authStore.user?.firstName} {authStore.user?.lastName}</div>
                    <div class="company" {...calcTitleFor(authStore.activeCounterparty.name)}>{authStore.activeCounterparty.name}</div>
                </div>
                {View.isDropdownOpen(dropdownId) && <div class="user-menu dropdown" onClick={() => View.setOpenDropdown(null)}>
                    <Link to="/agent/booking" class="item">
                        {t("Booking management")}
                    </Link>
                    { (authStore.activeCounterparty.inAgencyPermissions?.indexOf("ViewCounterpartyAllPaymentHistory") != -1) &&
                        <Link to="/account/statement" class="item">
                            {t("Account statement")}
                        </Link> }
                    { (authStore.activeCounterparty.inAgencyPermissions?.indexOf("AgentInvitation") != -1) &&
                        <Link to="/settings/invite" class="item">
                            {t("Send invitation")}
                        </Link> }
                    <Link to="/settings/personal" class="item">{t("Settings")}</Link>

                    <Link to="/logout" class="item">
                        {t("Log out")}
                    </Link>
                </div>}
            </div>
        );
    }
}

export default UserMenuDropdown;
