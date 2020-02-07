import React from "react";
import { Route, Switch } from "react-router-dom";

import accommodationTitle         from "pages/accommodation/title";
import accommodationVariants      from "pages/accommodation/variants";
import accommodationBooking       from "pages/accommodation/booking";
import accommodationConfirmation  from "pages/accommodation/confirmation";
import accommodationAgreements    from "pages/accommodation/agreements";

import paymentPage                from "pages/payment/payment";
import paymentResult              from "pages/payment/result";
import payment3DSCallback         from "pages/payment/callback3ds";
import paymentDirectLink          from "pages/payment/external/direct-link-page";
import paymentDirectLinkConfirm   from "pages/payment/external/direct-link-confirmation";

import accountRegistrationStep2   from "pages/account/registration-step-2";
import accountRegistrationStep3   from "pages/account/registration-step-3";
import accountInvite              from "pages/account/accept-invite";

import userBookingManagement      from "pages/user/booking-management";
import accountStatement           from "pages/user/account-statement";
import userInvite                 from "pages/user/create-invite";
import usersManagement            from "pages/user/usersManagement";

import contactUsPage              from "pages/common/contact";
import termsPage                  from "pages/common/terms";
import privacyPage                from "pages/common/privacy";
import aboutUsPage                from "pages/common/about";

import errorPage   from "pages/common/error";
import devAuthPage from "pages/account/odawara/confirmation";

export const routesWithSearch = [
    "/",
    "/search",
    "/accommodation/agreements"
];
export const routesWithHeaderAndFooter = [
    ...routesWithSearch,
    "/accommodation/booking",
    "/accommodation/confirmation*",
    "/contact", "/terms", "/privacy", "/about",
    "/payment/form",
    "/user/booking",
    "/user/payment-history",
    "/user/invite",
    "/users",
];
export const routesWithFooter = [
    ...routesWithHeaderAndFooter,
    "/pay/*",
    "/payment/confirmation"
];

const Routes = () => (
    <Switch>
        <Route exact path="/"                     component={accommodationTitle} />
        <Route path="/search"                     component={accommodationVariants} />
        <Route path="/accommodation/booking"      component={accommodationBooking} />
        <Route path="/accommodation/agreements"   component={accommodationAgreements} />
        <Route path={
            ["/accommodation/confirmation/:id",
             "/accommodation/confirmation"]}      component={accommodationConfirmation} />

        <Route path="/payment/form"               component={paymentPage} />
        <Route path={
            ["/payment/result/:ref",
             "/payment/result"]}                  component={paymentResult} />
        <Route path="/payments/callback"          component={payment3DSCallback} />

        <Route path="/pay/:code"                  component={paymentDirectLink} />
        <Route path="/payment/confirmation"       component={paymentDirectLinkConfirm} />

        <Route path="/signup/user"                component={accountRegistrationStep2} />
        <Route path="/signup/company"             component={accountRegistrationStep3} />
        <Route path="/signup/invite/:email/:code" component={accountInvite} />

        <Route path="/user/booking"               component={userBookingManagement} />
        <Route path="/user/payment-history"       component={accountStatement} />
        <Route path="/user/invite"                component={userInvite} />
        <Route path="/users"                      component={usersManagement} />

        <Route path="/contact"                    component={contactUsPage} />
        <Route path="/terms"                      component={termsPage} />
        <Route path="/privacy"                    component={privacyPage} />
        <Route path="/about"                      component={aboutUsPage} />

        <Route path="/dev/auth" component={devAuthPage} />

        <Route path="/auth" component={null} />
        <Route component={errorPage} />
    </Switch>
);

export default Routes;
