import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthStore from "stores/auth-store";

export default function () {
    const { t } = useTranslation();

    return <React.Fragment>
        <section className="users-pages__header">
            <h1>{AuthStore.activeCounterparty.name}</h1>
            {/*<p>{t('Account Not Verificated Yet')}</p>*/}
        </section>
        <div className="users-pages-navigation">
            <NavLink to="/settings/counterparty">{t('Company settings')}</NavLink >
            <NavLink to="/settings/admin" activeClassName="active">{t('Admin settings')}</NavLink >
            <NavLink to="/settings/users">{t('Users management')}</NavLink >
            {/*<NavLink to="/settings/notifications">{t('Notifications')}</NavLink >*/}
        </div>
    </React.Fragment>;
}
