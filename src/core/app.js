import React from 'react';
import '../../styles';

import { BrowserRouter, Route } from 'react-router-dom';
import ScrollToTop from './misc/scroll-to-top';
import { I18nextProvider } from 'react-i18next';
import internationalization from './internationalization';
import AuthCallback from 'core/auth/callback';
import AuthSilent from 'core/auth/silent';

import Header    from 'parts/header';
import Footer    from 'parts/footer';
import TopAlert  from 'parts/top-alert';
import Modal     from 'parts/modal';
import Search    from 'parts/search';

import Routes, { routesWithHeaderAndFooter, routesWithSearch } from './routes';

const App = () => (
    <I18nextProvider i18n={internationalization}>
        <BrowserRouter>
            <Route exact path={ routesWithHeaderAndFooter } component={ Header } />
            <TopAlert />
            <Route exact path={ routesWithSearch } component={ Search } />
            <Routes />
            <Route exact path={ routesWithHeaderAndFooter } component={ Footer } />
            <Modal />

            <ScrollToTop />
            <Route path="/auth/callback" component={ AuthCallback } />
            <Route path="/auth/silent" component={ AuthSilent } />
        </BrowserRouter>
    </I18nextProvider>
);

export default App;
