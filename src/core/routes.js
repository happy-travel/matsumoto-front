import React from 'react';
import { Route, Switch } from "react-router-dom";

import accommodationTitle         from 'pages/accommodation/title';
import accommodationVariants      from 'pages/accommodation/variants';
import accommodationBooking       from 'pages/accommodation/booking';
import accommodationConfirmation  from 'pages/accommodation/confirmation';

import account from "pages/account/login";

export const routesWithSearch = [
    "/",
    "/search"
];
export const routesWithHeaderAndFooter = [
    ...routesWithSearch,
    "/accommodation/booking",
    "/accommodation/confirmation"
];

const Routes = () => (
    <Switch>
        <Route exact path="/"                     component={accommodationTitle} />
        <Route path="/search"                     component={accommodationVariants} />
        <Route path="/accommodation/booking"      component={accommodationBooking} />
        <Route path="/accommodation/confirmation" component={accommodationConfirmation} />

        <Route path="/account"                    component={account} />
    </Switch>
);

export default Routes;
