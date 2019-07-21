import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import { ReactComponent as NoAvatar } from "./images/no-avatar.svg";
import { ReactComponent as FlagEN } from "./images/EN.svg";

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
                    <li><a href="#">{t('Transfers')}</a></li>
                    <li><a href="#">{t('Tours')}</a></li>
                    <li><a href="#">{t('Visa')}</a></li>
                </nav>
                <div class="switcher language-switcher">
                    <div class="flag">
                        <FlagEN />
                    </div>
                    <div class="name">English</div>
                    <div class="switch-arrow" />
                </div>
                <div class="switcher currency-switcher">
                    <div class="currency">USD <span>(US Dollars)</span></div>
                    <div class="switch-arrow" />
                </div>
                <Link to="/account" class="switcher currency-switcher">
                    <div class="avatar">
                        <NoAvatar />
                    </div>
                    <div class="double">
                        <div class="name">Serhii Movchan</div>
                        <div class="company">Nike</div>
                    </div>
                    <div class="switch-arrow" />
                </Link>
            </section>
        </header>
    );
};

export default Header;
