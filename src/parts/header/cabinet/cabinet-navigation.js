import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { $personal } from "stores";

const CabinetNavigation = () => {
    const { t } = useTranslation();
    return (
        <div className="cabinet-main-navigation">
            <section>
                <NavLink to="/settings/agent">
                    {t("Personal")}
                </NavLink>
                <NavLink to="/settings/agency">
                    {t("Agency")}
                </NavLink>
                { $personal.permitted("ObserveChildAgencies") &&
                    <NavLink to="/settings/child-agencies">
                        {t("Child Agencies")}
                    </NavLink>
                }
                { $personal.permitted("ObservePaymentHistory") &&
                    <NavLink to="/settings/account">
                        {t("Account Statement")}
                    </NavLink>
                }
            </section>
        </div>
    );
};

export default CabinetNavigation;
