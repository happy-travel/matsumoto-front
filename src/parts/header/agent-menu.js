import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { $personal } from "stores";

const AgentMenu = observer(() => {
    const agentName = ($personal.information?.firstName || "") + " " + ($personal.information?.lastName || "");

    const { t } = useTranslation();
    return (
        <div className="agent-menu">
            { $personal.permitted("AccommodationBooking") &&
                <Link className="button" to="/bookings">
                    {t("Bookings")}
                </Link>
            }
            <Link to="/settings/agent" className="button agent-link" title={agentName}>
                <span className="icon icon-burger" />
                <span className="avatar" />
            </Link>
        </div>
    );
});

export default AgentMenu;
