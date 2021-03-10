import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./user-menu";

import { Authorized } from "core/auth";

const Header = () => (
    <>
        <header>
            <section>
                <div className="logo-wrapper">
                    <Link to="/" className="logo" />
                </div>
                <div className="search-wrapper">

                </div>
                { Authorized() && <UserMenu /> }
            </section>
        </header>
        <div className="print">
            <img className="print-logo" src="/images/logo/logo.png" alt="" />
        </div>
    </>
);

export default Header;
