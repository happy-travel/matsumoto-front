import React from "react";
import "../../styles";

import { Router, Route, Switch } from "react-router-dom";
import ScrollToTop from "./misc/scroll-to-top";
import history from "./misc/history";
import { I18nextProvider } from "react-i18next";
import internationalization from "./internationalization";

import AuthCallback from "core/auth/callback";
import AuthSilent   from "core/auth/silent";
import AuthDefault  from "core/auth/default";
import AuthLogout   from "core/auth/logout";

import Header    from "parts/header";
import Footer    from "parts/footer";
import TopAlert  from "parts/top-alert";
import Modal     from "parts/modals";
import Search    from "parts/search-form";

import NotificationList from "parts/notifications/list";

import Routes, {
    routesWithHeaderAndFooter,
    routesWithSearch,
    routesWithFooter
} from "./routes";

import { Loader } from "simple";
import { Authorized, isPageAvailableAuthorizedOnly } from "core/auth";

const App = () => {
    var canShowContent = !isPageAvailableAuthorizedOnly() || Authorized();
    return (
    <I18nextProvider i18n={internationalization}>
        <Router history={history}>
            <NotificationList />
            <div className="body-wrapper">
                <Switch>
                    <Route exact path="/auth/callback" component={ AuthCallback } />
                    <Route exact path="/auth/silent"   component={ AuthSilent } />
                    <Route exact path="/logout"        component={ AuthLogout } />
                    <Route>
                        <Route component={ AuthDefault } />
                        { canShowContent ? <>
                            <div className="block-wrapper">
                                <Route exact path={ routesWithHeaderAndFooter } component={ Header } />
                                <TopAlert />
                                <Route exact path={ routesWithSearch } component={ Search } />
                                <Routes />
                            </div>
                            <Route exact path={ routesWithFooter } component={ Footer } />
                        </> : <Loader page /> }
                    </Route>
                </Switch>
            </div>
            <Modal />

            <ScrollToTop />
        </Router>
    </I18nextProvider>
)};

export default App;
