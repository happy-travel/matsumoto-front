import React from 'react';
import '../styles';

import { BrowserRouter, Route, Link } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import internationalization from './internationalization';

import Header from './parts/header';
import Footer from './parts/footer';

import Routes from './routes';

const App = () => (
    <React.Fragment>
        <I18nextProvider i18n={ internationalization }>
            <BrowserRouter>
                <Header />
                <Routes />
                <Footer />
            </BrowserRouter>
        </I18nextProvider>
    </React.Fragment>
);

export default App;
