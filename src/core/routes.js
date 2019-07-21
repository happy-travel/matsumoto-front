import React from 'react';
import { Route, Switch } from "react-router-dom";

import main from 'pages/main';
import variants from 'pages/variants';
import booking from 'pages/booking';
import third from 'pages/third';
import account from "pages/account/login";

export const routesWithSearch = [
    "/",
    "/search"
];
export const routesWithHeaderAndFooter = [
    ...routesWithSearch,
    "/accommodation/booking"
];

const Routes = () => (
    <Switch>
        <Route exact path="/" component={main} />
        <Route path="/search" component={variants} />
        <Route path="/accommodation/booking" component={booking} />
        <Route path="/third" component={third} />

        <Route path="/account" component={account} />
    </Switch>
);

export default Routes;
