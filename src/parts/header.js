import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { localStorage } from "core";
import LocaleSwitcher from "components/switchers/locale";
import CurrencySwitcher from "components/switchers/currency";
import UserMenu from "components/switchers/user-menu";
import authStore from "stores/auth-store";

const Header = () => {
    const { t } = useTranslation();

    return (
        <header>
            <section>
                <div class="logo-wrapper">
                    <Link to="/" class="logo" />
                </div>
                <nav>
                    <li><Link class="selected" to="/">{t('Accommodation')}</Link></li>
                    { /*
                    <li><a href="#" onClick={(e)=>e.preventDefault()}>{t('Transfers')}</a></li>
                    <li><a href="#" onClick={(e)=>e.preventDefault()}>{t('Tours')}</a></li>
                    <li><a href="#" onClick={(e)=>e.preventDefault()}>{t('Visa')}</a></li>
                    */ }
                </nav>
                <LocaleSwitcher />
                { !!authStore.userCache?.access_token && <CurrencySwitcher /> }
                { !!authStore.userCache?.access_token && <UserMenu /> }
            </section>
        </header>
    );
};

export default Header;
