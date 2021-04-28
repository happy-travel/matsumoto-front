import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { price } from "simple";
import CabinetNavigation from "./cabinet-navigation";
import CabinetSecondNavigation from "./cabinet-second-navigation";
import { API } from "core";
import { $personal } from "stores";

const CabinetHeader = observer(() => {
    useEffect(() => {
        if ($personal.permitted("ObserveBalance"))
            API.get({
                url: API.ACCOUNT_BALANCE("USD"),
                success: (value) => $personal.setBalance(value)
            });
    }, [$personal.permitted("ObserveBalance")]);

    const { t } = useTranslation();
    return (
        <>
            <div className="cabinet-header">
                <section>
                    <div className="agent">
                        <div className="photo">
                            <div className="no-avatar" />
                        </div>
                        <div className="data">
                            <h1>{$personal.information?.firstName} {$personal.information?.lastName}</h1>
                            <div className="company">
                                {$personal.activeCounterparty.name}{" "}
                                ({$personal.activeCounterparty.counterpartyState?.replace(/([A-Z])/g, " $1").trim()}){" "}
                                <b className={"status " + $personal.activeCounterparty.counterpartyState} />
                            </div>
                            { $personal.permitted("ObserveBalance") &&
                                <div>
                                    {t("Balance")}:{" "}
                                    <span>{price($personal.balance?.currency, $personal.balance?.balance)}</span>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="logout-wrapper">
                        <Link to="/logout" className="button">
                            <i className="icon icon-logout" />
                            {t("Log out")}
                        </Link>
                    </div>
                </section>
                <CabinetNavigation />
            </div>
            <CabinetSecondNavigation />
        </>
    );
});

export default CabinetHeader;
