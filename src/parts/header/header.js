import React from "react";
import { observer } from "mobx-react";
import { Link, Route } from "react-router-dom";
import AgentMenu from "./agent-menu";
import { routesWithSearch } from "core/routes";
import Search from "parts/search-form/search-form";
import { $personal } from "stores";

const Header = observer(() => (
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
                { $personal.information?.email &&
                    <AgentMenu />
                }
            </section>
        </header>
        <div className="print">
            <img className="print-logo" src="/images/logo/logo.png" alt="" />
        </div>
    </>
));

export default Header;
