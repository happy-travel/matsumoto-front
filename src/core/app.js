import React from 'react';
import '../../styles';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from './misc/scroll-to-top';
import { I18nextProvider } from 'react-i18next';
import internationalization from './internationalization';

import AuthCallback from 'core/auth/callback';
import AuthSilent   from 'core/auth/silent';
import AuthDefault  from 'core/auth/default';

import Header    from 'parts/header';
import Footer    from 'parts/footer';
import TopAlert  from 'parts/top-alert';
import Modal     from 'parts/modal';
import Search    from 'parts/search';

import Routes, { routesWithHeaderAndFooter, routesWithSearch } from './routes';

const App = () => (
    <I18nextProvider i18n={internationalization}>
        <BrowserRouter>
            <div class="body-wrapper">
                <Switch>
                    <Route exact path="/auth/callback" component={ AuthCallback } />
                    <Route exact path="/auth/silent" component={ AuthSilent } />
                    <Route component={ AuthDefault } />
                </Switch>

                <Route exact path={ routesWithHeaderAndFooter } component={ Header } />
                <TopAlert />
                <Route exact path={ routesWithSearch } component={ Search } />
                <Routes />
                <Route exact path={ routesWithHeaderAndFooter } component={ Footer } />
            </div>
            <Modal />

            <ScrollToTop />
        </BrowserRouter>
    </I18nextProvider>
);

export default App;
