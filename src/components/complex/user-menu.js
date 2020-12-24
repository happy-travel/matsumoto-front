import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import authStore from "stores/auth-store";

const calcTitleFor = (value) => (value?.length > 14 ? { title: value } : {});

@observer
class UserMenu extends React.Component {
    render() {
        const { t } = useTranslation();

        var userName = (authStore.user?.firstName || "") + " " + (authStore.user?.lastName || "");
        return (
            <React.Fragment>
                <Link to={
                    authStore.permitted("AgencyBookingsManagement") ?
                        "/agency/bookings" :
                        "/agent/bookings"
                } class="button transparent-with-border">
                    {t("Bookings")}
                </Link>
                <Link to="/settings" class="switcher user-switcher">
                    <div class="avatar" />
                    <div class="double">
                        <div
                            class="name"
                            {...calcTitleFor(userName)}
                        >
                            <span>
                                {userName}
                            </span>
                            <i class="icon icon-gear" />
                        </div>
                        <div
                            class="company"
                            {...calcTitleFor(authStore.activeCounterparty.name)}
                        >
                            {authStore.activeCounterparty.name}
                        </div>
                    </div>
                </Link>
            </React.Fragment>
        );
    }
}

export default UserMenu;
