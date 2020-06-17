import React from "react";
import "../../styles";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./misc/scroll-to-top";
import { I18nextProvider } from "react-i18next";
import internationalization from "./internationalization";

import AuthCallback from "core/auth/callback";
import AuthSilent   from "core/auth/silent";
import AuthDefault  from "core/auth/default";

import Header    from "parts/header";
import Footer    from "parts/footer";
import TopAlert  from "parts/top-alert";
import Modal     from "parts/modal";
import Search    from "parts/search";

import Routes, {
    routesWithHeaderAndFooter,
    routesWithSearch,
    routesWithFooter
} from "./routes";

import { Loader } from "simple";
import { isRedirectNeeded } from "core";

import authStore from "stores/auth-store";

const App = () => {
    var canShowContent = !isRedirectNeeded() || authStore.userCache?.access_token;
    return (
    <I18nextProvider i18n={internationalization}>
        <BrowserRouter>
            <div class="body-wrapper">
                <Switch>
                    <Route exact path="/auth/callback" component={ AuthCallback } />
                    <Route exact path="/auth/silent" component={ AuthSilent } />
                    <Route>
                        <Route component={ AuthDefault } />
                        { canShowContent ? <React.Fragment>
                            <div class="block-wrapper">
                                <Route exact path={ routesWithHeaderAndFooter } component={ Header } />
                                <TopAlert />
                                <Route exact path={ routesWithSearch } component={ Search } />
                                <Routes />
                            </div>
                            <Route exact path={ routesWithFooter } component={ Footer } />
                        </React.Fragment> : <Loader page /> }
                    </Route>
                </Switch>
            </div>
            <Modal />

            <ScrollToTop />
        </BrowserRouter>
    </I18nextProvider>
)};

export default App;
