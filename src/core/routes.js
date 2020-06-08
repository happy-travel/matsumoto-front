import React from "react";
import { Switch } from "react-router-dom";
import Route from "./misc/route";

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

import usersManagement            from "pages/settings/users-management";
import addNewUser                 from "pages/settings/add-new-user";

import AdminSettings              from "pages/settings/admin-settings";
import CounterpartySettings       from "pages/settings/counterparty-settings";

import contactUsPage              from "pages/common/contact";
import termsPage                  from "pages/common/terms";
import privacyPage                from "pages/common/privacy";
import aboutUsPage                from "pages/common/about";

import logoutPage                 from "core/auth/logout";

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
    "/settings/users/:agentId/:counterpartyId/:agencyId/",
    "/settings/admin",
    "/settings/counterparty"
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
        <Route exact path="/search"               component={accommodationVariants} title="Search Results" />
        <Route exact path="/search/contract"      component={accommodationContractsSets} title="Select An Accommodation" />
        <Route path="/accommodation/booking"      component={accommodationBooking} title="Accommodation Booking" />
        <Route path={[
                    "/accommodation/confirmation/:id",
                    "/accommodation/confirmation"
                    ]}                            component={accommodationConfirmation} title="Your Booking Confirmation" />

        <Route path="/payment/form"               component={paymentPage} title="Payment" />
        <Route path="/payment/account"            component={paymentAccountPage} title="Account" />
        <Route path={[
                    "/payment/result/:ref",
                    "/payment/result"
                    ]}                            component={paymentResult} title="Processing" />
        <Route path="/payments/callback"          component={payment3DSCallback} title="Processing" />

        <Route path="/pay/:code"                  component={paymentDirectLink} />
        <Route path="/payment/confirmation"       component={paymentDirectLinkConfirm} title="Confirmation" />

        <Route path="/signup/user"                component={accountRegistrationStep2} title="Sign Up" />
        <Route path="/signup/counterparty"        component={accountRegistrationStep3} title="Sign Up" />
        <Route path="/signup/invite/:email/:code" component={accountInvite} title="Sign Up" />

        <Route path="/user/booking"               component={userBookingManagement} title="Your Bookings" />
        <Route path="/user/payment-history"       component={accountStatement} title="Your Payments" />
        <Route path="/user/invite"                component={userInvite} title="Send Invite" />

        <Route path="/settings/users/add"         component={addNewUser} title="Add New User" />
        <Route path="/settings/users/:agentId/:counterpartyId/:agencyId/"
                                                  component={addNewUser} title="User Settings" />
        <Route path="/settings/users"             component={usersManagement} title="User Management" />

        <Route path="/settings/admin"             component={AdminSettings} title="Your Settings" />
        <Route path="/settings/counterparty"      component={CounterpartySettings} title="Counterparty Settings" />

        <Route path="/contact"                    component={contactUsPage} title="Contact Us" />
        <Route path="/terms"                      component={termsPage} title="Terms & Conditions" />
        <Route path="/privacy"                    component={privacyPage} title="Privacy Policy" />
        <Route path="/about"                      component={aboutUsPage} title="About Us" />

        <Route path="/dev/auth" component={devAuthPage} />

        <Route path="/logout" component={logoutPage} />
        <Route path="/auth" component={null} />
        <Route component={errorPage} />
    </Switch>
);

export default Routes;
