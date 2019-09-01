import React from 'react';
import { Route, Switch } from "react-router-dom";

import accommodationTitle         from 'pages/accommodation/title';
import accommodationVariants      from 'pages/accommodation/variants';
import accommodationBooking       from 'pages/accommodation/booking';
import accommodationConfirmation  from 'pages/accommodation/confirmation';

import accountRegistrationStep2   from "pages/account/registration-step-2";
import accountRegistrationStep3   from "pages/account/registration-step-3";

import errorPage   from "pages/error";
import devAuthPage from "pages/account/odawara/confirmation";

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
        <Route path="/signup/user"                component={accountRegistrationStep2} />
        <Route path="/signup/company"             component={accountRegistrationStep3} />

        <Route path="/dev/auth" component={devAuthPage} />

        <Route path="/auth" component={null} />
        <Route component={errorPage} />
    </Switch>
);

export default Routes;
