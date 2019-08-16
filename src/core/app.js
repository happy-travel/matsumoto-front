import React from 'react';
import '../../styles';

import { BrowserRouter, Route } from "react-router-dom";
import ScrollToTop from './misc/scroll-to-top';
import { I18nextProvider } from 'react-i18next';
import internationalization from './internationalization';

import Header from 'parts/header';
import Footer from 'parts/footer';
import Alert  from 'parts/alert';
import Modal  from 'parts/modal';
import Search from 'parts/search';

import Routes, { routesWithHeaderAndFooter, routesWithSearch } from './routes';

const App = () => (
    <I18nextProvider i18n={internationalization}>
        <BrowserRouter>
            <ScrollToTop />
            <Route exact path={ routesWithHeaderAndFooter } render={() =>
                <Header />
            } />
            <Alert />
            <Route exact path={ routesWithSearch } render={() =>
                <Search />
            } />
            <Routes />
            <Route exact path={ routesWithHeaderAndFooter } render={() =>
                <Footer />
            } />
            <Modal />
        </BrowserRouter>
    </I18nextProvider>
);

export default App;
