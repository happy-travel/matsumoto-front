import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserMenu from "components/complex/user-menu";

import { Authorized } from "core/auth";

const Header = () => {
    const { t } = useTranslation();

    return (
        <>
            <header>
                <section>
                    <div className="logo-wrapper">
                        <Link to="/" className="logo" />
                    </div>
                    <nav>
                        { Authorized() && <li><Link className="active" to="/">{t("Accommodations")}</Link></li> }
                    </nav>
                    { Authorized() && <UserMenu /> }
                </section>
            </header>
            <div className="print">
                <img className="print-logo" src="/images/logo/logo.png" alt="" />
            </div>
        </>
    );
};

export default Header;
