import React from "react";
import { Switch } from "react-router-dom";
import Route from "./misc/route";

import accommodationTitle         from "pages/accommodation/title";
import accommodationVariants      from "pages/accommodation/variants";
import accommodationBooking       from "pages/accommodation/booking";
import accommodationConfirmation  from "pages/accommodation/confirmation";
import accommodationContractsSets from "pages/accommodation/room-contract-sets";

import paymentPage                from "pages/payment/payment";
import paymentResult              from "pages/payment/result";
import payment3DSCallback         from "pages/payment/callback3ds";
import paymentDirectLink          from "pages/payment/external/direct-link-page";
import paymentDirectLinkConfirm   from "pages/payment/external/direct-link-confirmation";

import registrationAgent          from "pages/account/registration-agent";
import registrationCounterparty   from "pages/account/registration-counterparty";
import acceptInvite               from "pages/account/accept-invite";

import userBookingManagement      from "pages/user/booking-management/booking-management";
import agencyBookingsManagement   from "pages/user/agency-bookings-management/agency-bookings-management";
import accountStatement           from "pages/user/account-statement/account-statement";
import userInvite                 from "pages/user/create-invite";

import agentsManagement           from "pages/settings/agents-management";
import agentPermissionsManagement from "pages/settings/agent-permissions-management";

import personalSettings           from "pages/settings/personal-settings";
import counterpartySettings       from "pages/settings/counterparty-settings";

import contactUsPage              from "pages/common/contact";
import termsPage                  from "pages/common/terms";
import privacyPage                from "pages/common/privacy";
import aboutUsPage                from "pages/common/about";

import errorPage                  from "pages/common/error";

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
    "/payment/form",
    "/agent/bookings",
    "/agency/bookings",
    "/settings/*",
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
        <Route path={[
                    "/payment/result/:ref",
                    "/payment/result"
                    ]}                            component={paymentResult} title="Processing" />
        <Route path="/payments/callback"          component={payment3DSCallback} title="Processing" />

        <Route path="/pay/:code"                  component={paymentDirectLink} />
        <Route path="/payment/confirmation"       component={paymentDirectLinkConfirm} title="Confirmation" />

        <Route path="/signup/agent"               component={registrationAgent} title="Sign Up" />
        <Route path="/signup/counterparty"        component={registrationCounterparty} title="Sign Up" />
        <Route path="/signup/invite/:email/:code" component={acceptInvite} title="Sign Up" />

        <Route path="/agent/bookings"             component={userBookingManagement} title="Your Bookings" />
        <Route path="/agency/bookings"            component={agencyBookingsManagement} title="Agency Bookings" />
        <Route path="/settings/account"           component={accountStatement} title="Account statement" />
        <Route path="/settings/invite"            component={userInvite} title="Send Invite" />

        <Route path="/settings/agents/:agentId/"
                                                  component={agentPermissionsManagement} title="Agent Permissions" />
        <Route path="/settings/agents"            component={agentsManagement} title="Agent Management" />

        <Route path="/settings/personal"          component={personalSettings} title="Personal Settings" />
        <Route path="/settings/counterparty"      component={counterpartySettings} title="Counterparty Settings" />

        <Route path="/contact"                    component={contactUsPage} title="Contact Us" />
        <Route path="/terms"                      component={termsPage} title="Terms & Conditions" />
        <Route path="/privacy"                    component={privacyPage} title="Privacy Policy" />
        <Route path="/about"                      component={aboutUsPage} title="About Us" />

        <Route component={errorPage} />
    </Switch>
);

export default Routes;
