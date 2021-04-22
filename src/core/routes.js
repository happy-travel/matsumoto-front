import React from "react";
import { Switch } from "react-router-dom";
import Route from "./misc/route";

import accommodationTitle                 from "pages/accommodation/title";
import accommodationSearchResults         from "pages/accommodation/search-results/search-results";
import accommodationBooking               from "pages/accommodation/booking/booking";
import accommodationContractsSets         from "pages/accommodation/room-contract-sets/room-contract-sets";

import accommodationConfirmation          from "pages/accommodation/booking-confirmation";
import accommodationViewBooking           from "pages/accommodation/view-booking-page";
import accommodationConfirmationInvoice   from "pages/accommodation/confirmation/invoice";
import accommodationConfirmationVoucher   from "pages/accommodation/confirmation/voucher";

import paymentPage                        from "pages/payment/payment-page";
import paymentResultFirst                 from "pages/payment/result-first";
import paymentResultSecond                from "pages/payment/result-second";
import paymentDirectLink                  from "pages/payment/external/direct-link-page";
import paymentDirectLinkConfirm           from "pages/payment/external/direct-link-confirmation";

import registrationAgent                  from "pages/account/registration-agent";
import registrationCounterparty           from "pages/account/registration-counterparty";
import acceptInvite                       from "pages/account/accept-invite";

import bookingsManagement                 from "pages/agent/bookings-management/bookings-management";
import accountStatement                   from "pages/agent/account-statement/account-statement";
import invitationsManagement              from "pages/settings/invitations";
import invitationSend                     from "pages/settings/invitation-send";
import invitationResend                   from "pages/settings/invitation-resend";

import childAgencyInvitation              from "pages/settings/child-agencies/invitation";
import childAgencyObserve                 from "pages/settings/child-agencies/observe";
import childAgencyItem                    from "pages/settings/child-agencies/child-agency";

import agentsManagement                   from "pages/settings/agents-management";
import agentPermissionsManagement         from "pages/settings/agent-permissions-management";

import personalSettings                   from "pages/settings/personal-settings";
import counterpartySettings               from "pages/settings/counterparty-settings";

import contactUsPage                      from "pages/common/contact";
import termsPage                          from "pages/common/terms";
import privacyPage                        from "pages/common/privacy";
import aboutUsPage                        from "pages/common/about";

import NotFoundPage                       from "pages/common/not-found-page";

export const routesWithHeaderAndFooter = [
    "/",
    "/search",
    "/search/contract",
    "/accommodation/booking",
    "/booking*",
    "/accommodation/confirmation",
    "/contact", "/terms", "/privacy", "/about",
    "/payment/form",
    "/settings*",
];

export const routesWithFooter = [
    ...routesWithHeaderAndFooter,
    "/pay/*",
    "/signup/*"
];

export const routesWithSearch = [
    "/search",
    "/search/contract"
];


const Routes = () => (
<Switch>
    <Route exact path="/"                           component={accommodationTitle} />
    <Route exact path="/search"                     component={accommodationSearchResults} title="Search Results" />
    <Route exact path="/search/contract"            component={accommodationContractsSets} title="Select An Accommodation" />
    <Route path="/accommodation/booking"            component={accommodationBooking} title="Accommodation Booking" />
    <Route path="/booking/:id/invoice"              component={accommodationConfirmationInvoice} title="Invoice" />
    <Route path="/booking/:id/voucher"              component={accommodationConfirmationVoucher} title="Voucher" />
    <Route path="/accommodation/confirmation"       component={accommodationConfirmation} title="Your Booking Confirmation" />
    <Route path="/booking/:code"                    component={accommodationViewBooking} title="Booking" />

    <Route path="/payment/form"                     component={paymentPage} title="Payment" />
    <Route path={[
                "/payment/result/:ref",
                "/payment/result"
                ]}                                  component={paymentResultFirst} title="Processing" />
    <Route path="/payments/callback"                component={paymentResultSecond} title="Processing" />

    <Route path="/pay/confirmation"                 component={paymentDirectLinkConfirm} title="Confirmation" />
    <Route path="/pay/:code"                        component={paymentDirectLink} />

    <Route path="/signup/agent"                     component={registrationAgent} title="Sign Up" />
    <Route path="/signup/counterparty"              component={registrationCounterparty} title="Sign Up" />
    <Route path="/signup/invite/:email/:code"       component={acceptInvite} title="Sign Up" />

    <Route path="/bookings"                         component={bookingsManagement} title="Bookings" />
    <Route path="/settings/account"                 component={accountStatement} title="Account Statement" />
    <Route path="/settings/invitations/send"        component={invitationSend} title="Invite an Agent" />
    <Route path="/settings/invitations/:id"         component={invitationResend} title="Invitation" />
    <Route path="/settings/invitations"             component={invitationsManagement} title="Invitations" />
    <Route exact path="/settings/child-agencies"    component={childAgencyObserve} title="Observe Child Agency" />
    <Route path="/settings/child-agencies/invite"   component={childAgencyInvitation} title="Invite Child Agency" />
    <Route path="/settings/child-agencies/:id"      component={childAgencyItem} title="Child Agency" />
    <Route path="/settings/agents/:agentId/"        component={agentPermissionsManagement} title="Agent Permissions" />
    <Route path="/settings/agents"                  component={agentsManagement} title="Agent Management" />
    <Route path="/settings/counterparty"            component={counterpartySettings} title="Counterparty Settings" />
    <Route exact path="/settings"                   component={personalSettings} title="Personal Settings" />

    <Route path="/contact"                          component={contactUsPage} title="Contacts" />
    <Route path="/terms"                            component={termsPage} title="Terms & Conditions" />
    <Route path="/privacy"                          component={privacyPage} title="Privacy Policy" />
    <Route path="/about"                            component={aboutUsPage} title="About Us" />

    <Route component={NotFoundPage} />
</Switch>
);

export default Routes;
