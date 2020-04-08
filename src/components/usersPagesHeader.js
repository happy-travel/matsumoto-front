import React from "react";
import { NavLink  } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthStore from "stores/auth-store";

export default function () {
    const { t } = useTranslation();

    return  <>
        <section className="users-pages__header">
            <h1>{AuthStore.currentCompany.name} SETTINGS</h1>
            {/*<p>{t('Account Not Verificated Yet')}</p>*/}
        </section>
        <div className="users-pages-navigation">
            <NavLink to="/settings/company">{t('Company settings')}</NavLink >
            <NavLink to="/settings/admin" activeClassName="active">{t('Admin settings')}</NavLink >
            <NavLink to="/settings/users">{t('users management')}</NavLink >
            {/*<NavLink to="/settings/notifications">{t('Notifications')}</NavLink >*/}
        </div>
    </>
}
