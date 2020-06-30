import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserMenu from "components/complex/user-menu";

import { Authorized } from "core/auth";

const Header = () => {
    const { t } = useTranslation();

    return (
        <header>
            <section>
                <div class="logo-wrapper">
                    <Link to="/" class="logo" />
                </div>
                <nav>
                    { Authorized() && <li><Link class="selected" to="/">{t("Accommodations")}</Link></li> }
                </nav>
                { Authorized() && <UserMenu /> }
            </section>
        </header>
    );
};

export default Header;
