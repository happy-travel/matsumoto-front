import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import authStore from "stores/auth-store";

@observer
class UserMenu extends React.Component {
    render() {
        const { t } = useTranslation();

        var userName = (authStore.user?.firstName || "") + " " + (authStore.user?.lastName || "");
        return (
            <div className="user-menu">
                <Link className="button" to="/bookings">
                    {t("Bookings")}
                </Link>
                <Link to="/settings" className="button user-link" title={userName}>
                    <span className="icon icon-user-burger" />
                    <span className="avatar" />
                </Link>
            </div>
        );
    }
}

export default UserMenu;
