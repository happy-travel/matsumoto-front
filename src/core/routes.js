import React from "react";
import { Route, Switch } from "react-router-dom";

import accommodationTitle         from "pages/accommodation/title";
import accommodationVariants      from "pages/accommodation/variants";
import accommodationBooking       from "pages/accommodation/booking";
import accommodationConfirmation  from "pages/accommodation/confirmation";
import accommodationContractsSets from "pages/accommodation/room-contract-sets";

import paymentPage                from "pages/payment/payment";
import paymentAccountPage         from "pages/payment/account";
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

import usersManagement            from "pages/settings/usersManagement";
import addNewUser                 from "pages/settings/addNewUser";

import AdminSettings              from "pages/settings/admin-settings";
import CompanySettings            from "pages/settings/companySettings";

import contactUsPage              from "pages/common/contact";
import termsPage                  from "pages/common/terms";
import privacyPage                from "pages/common/privacy";
import aboutUsPage                from "pages/common/about";

import errorPage   from "pages/common/error";
import devAuthPage from "pages/account/odawara/confirmation";

export const routesWithSearch = [
    "/",
    "/search",
    "/search/contract"
];
export const routesWithHeaderAndFooter = [
    ...routesWithSearch,
    "/accommodation/booking",
    "/accommodation/confirmation*",
    "/contact", "/terms", "/privacy", "/about",
    "/payment/form", "/payment/account",
    "/user/booking",
    "/user/payment-history",
    "/user/invite",
    "/settings/users",
    "/settings/users/:customerId/:companyId/:branchId/",
    "/settings/admin",
    "/settings/company"
];
export const routesWithFooter = [
    ...routesWithHeaderAndFooter,
    "/pay/*",
    "/payment/confirmation",
    "/signup/*"
];

const Routes = () => (
    <Switch>
        <Route exact path="/"                     component={accommodationTitle} />
        <Route exact path="/search"               component={accommodationVariants} />
        <Route exact path="/search/contract"      component={accommodationContractsSets} />
        <Route path="/accommodation/booking"      component={accommodationBooking} />
        <Route path={
               ["/accommodation/confirmation/:id",
                "/accommodation/confirmation"]}   component={accommodationConfirmation} />

        <Route path="/payment/form"               component={paymentPage} />
        <Route path="/payment/account"            component={paymentAccountPage} />
        <Route path={
               ["/payment/result/:ref",
                "/payment/result"]}               component={paymentResult} />
        <Route path="/payments/callback"          component={payment3DSCallback} />

        <Route path="/pay/:code"                  component={paymentDirectLink} />
        <Route path="/payment/confirmation"       component={paymentDirectLinkConfirm} />

        <Route path="/signup/user"                component={accountRegistrationStep2} />
        <Route path="/signup/company"             component={accountRegistrationStep3} />
        <Route path="/signup/invite/:email/:code" component={accountInvite} />

        <Route path="/user/booking"               component={userBookingManagement} />
        <Route path="/user/payment-history"       component={accountStatement} />
        <Route path="/user/invite"                component={userInvite} />

        <Route path="/settings/users/add"         component={addNewUser} />
        <Route path="/settings/users/:customerId/:companyId/:branchId/"
                                                  component={addNewUser} />
        <Route exact path="/settings/users"       component={usersManagement} />

        <Route path="/settings/admin"             component={AdminSettings} />
        <Route path="/settings/company"           component={CompanySettings} />

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
