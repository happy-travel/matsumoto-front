import React from 'react';
import { Route, Switch } from "react-router-dom";

import main from './pages/main';
import variants from './pages/variants';
import third from './pages/third';
import account from "./pages/account/login";

export const routesWithHeaderAndFooter = [ "/", "/search" ];
export const routesWithSearch = routesWithHeaderAndFooter;

const Routes = () => (
    <Switch>
        <Route exact path="/" component={main} />
        <Route path="/search" component={variants} />
        <Route path="/third" component={third} />

        <Route path="/account" component={account} />
    </Switch>
);

export default Routes;
