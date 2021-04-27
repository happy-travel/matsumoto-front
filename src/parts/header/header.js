import React from "react";
import { observer } from "mobx-react";
import { Link, Route, Switch } from "react-router-dom";
import AgentMenu from "./agent-menu";
import { routesWithSearch } from "core/routes";
import CabinetHeader from "./cabinet/cabinet-header";
import Search from "parts/search-form/search-form";
import { $personal } from "stores";

const HeaderInner = observer(({ className, withSearch }) => (
    <header className={className}>
        <section>
            <div className="logo-wrapper">
                <div className="logo">
                    <Link to="/" className="image" />
                    <div className="underline" />
                </div>
            </div>
            { withSearch &&
                <div className="search-wrapper">
                    <Search key="search-short" />
                </div>
            }
            { $personal.information?.email &&
                <AgentMenu />
            }
        </section>
    </header>
));

const Header = () => (
    <>
        <Switch>
            <Route exact path={ routesWithSearch } component={() => (
                <HeaderInner
                    className="with-search"
                    withSearch
                />
            )} />
            <Route component={() => (
                <HeaderInner />
            )} />
        </Switch>
        <div className="print">
            <img className="print-logo" src="/images/logo/logo.png" alt="" />
        </div>
        <Route path="/settings" component={CabinetHeader} />
    </>
);

export default Header;
