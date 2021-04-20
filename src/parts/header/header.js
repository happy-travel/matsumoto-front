import React from "react";
import { Link, Route } from "react-router-dom";
import AgentMenu from "./agent-menu";
import { routesWithSearch } from "core/routes";
import { Authorized } from "core/auth";
import Search from "parts/search-form/search-form";

const Header = () => (
    <>
        <header>
            <section>
                <div className="logo-wrapper">
                    <div className="logo">
                        <Link to="/" className="image" />
                        <div className="underline" />
                    </div>
                </div>
                <Route exact path={ routesWithSearch } component={() => (
                    <div className="search-wrapper">
                        <Search />
                    </div>
                )} />
                { Authorized() && <AgentMenu /> }
            </section>
        </header>
        <div className="print">
            <img className="print-logo" src="/images/logo/logo.png" alt="" />
        </div>
    </>
);

export default Header;
