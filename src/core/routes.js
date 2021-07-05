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

import signUpPage                         from "pages/signup/signup";
import acceptInvite                       from "pages/signup/accept-invite";

import bookingsManagement                 from "pages/bookings-management/bookings-management";

import applicationSettings                from "pages/cabinet/personal/application-settings";
import personalInformation                from "pages/cabinet/personal/personal-information";

import invitationsManagement              from "pages/cabinet/agency/invitations";
import invitationSend                     from "pages/cabinet/agency/invitation-send";
import invitationResend                   from "pages/cabinet/agency/invitation-resend";
import agentsManagement                   from "pages/cabinet/agency/agents-management";
import agentManagement                    from "pages/cabinet/agency/agent-management";
import agencyLegalInformation             from "pages/cabinet/agency/agency-legal-information";
import voucherPersonalization             from "pages/cabinet/agency/agency-voucher-personalization";

import childAgencyInvitation              from "pages/cabinet/child-agencies/invitation";
import childAgencyObserve                 from "pages/cabinet/child-agencies/observe";
import childAgencyItem                    from "pages/cabinet/child-agencies/child-agency";

import accountStatement                   from "pages/cabinet/account/account-statement";

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
    "/signup"
];

export const routesWithSearch = [
    "/search",
    "/search/contract"
];


const Routes = () => (
<Switch>
    <Route exact path="/"                                 component={accommodationTitle} />
    <Route exact path="/search"                           component={accommodationSearchResults} title="Search Results" />
    <Route exact path="/search/contract"                  component={accommodationContractsSets} title="Select An Accommodation" />
    <Route exact path="/accommodation/booking"            component={accommodationBooking} title="Accommodation Booking" />
    <Route exact path="/booking/:id/invoice"              component={accommodationConfirmationInvoice} title="Invoice" />
    <Route exact path="/booking/:id/voucher"              component={accommodationConfirmationVoucher} title="Voucher" />
    <Route exact path="/accommodation/confirmation"       component={accommodationConfirmation} title="Your Booking Confirmation" />
    <Route exact path="/booking/:code"                    component={accommodationViewBooking} title="Booking" />
    <Route exact path="/bookings"                         component={bookingsManagement} title="Bookings" />

    <Route exact path="/payment/form"                     component={paymentPage} title="Payment" />
    <Route exact path={[
                "/payment/result/:ref",
                "/payment/result"
                ]}                                        component={paymentResultFirst} title="Processing" />
    <Route exact path="/payments/callback"                component={paymentResultSecond} title="Processing" />

    <Route exact path="/pay/confirmation"                 component={paymentDirectLinkConfirm} title="Confirmation" />
    <Route exact path="/pay/:code"                        component={paymentDirectLink} />

    <Route exact path="/signup"                           component={signUpPage} title="Sign Up" />
    <Route exact path="/signup/invite/:email/:code"       component={acceptInvite} title="Sign Up" />

    <Route exact path={["/settings", "/settings/agent"]}
                                                          component={applicationSettings} title="Application Settings" />
    <Route exact path="/settings/agent/personal"          component={personalInformation} title="Personal Information" />
    <Route exact path={["/settings/agency", "/settings/agency/information"]}
                                                          component={agencyLegalInformation} title="Legal Information" />
    <Route exact path="/settings/agency/agents"           component={agentsManagement} title="Agent Management" />
    <Route exact path="/settings/agency/agents/:agentId/" component={agentManagement} title="Agent Management" />
    <Route exact path="/settings/agency/invitations/send" component={invitationSend} title="Invite an Agent" />
    <Route exact path="/settings/agency/invitations/:id"  component={invitationResend} title="Invitation" />
    <Route exact path="/settings/agency/invitations"      component={invitationsManagement} title="Invitations" />
    <Route exact path="/settings/agency/voucher"          component={voucherPersonalization} title="Agency Voucher Personalization" />
    <Route exact path="/settings/child-agencies"          component={childAgencyObserve} title="Child Agencies" />
    <Route exact path="/settings/child-agencies/invite"   component={childAgencyInvitation} title="Invite Child Agency" />
    <Route exact path="/settings/child-agencies/:id"      component={childAgencyItem} title="Child Agency" />
    <Route exact path="/settings/account"                 component={accountStatement} title="Account Statement" />

    <Route exact path="/contact"                          component={contactUsPage} title="Contacts" />
    <Route exact path="/terms"                            component={termsPage} title="Terms & Conditions" />
    <Route exact path="/privacy"                          component={privacyPage} title="Privacy Policy" />
    <Route exact path="/about"                            component={aboutUsPage} title="About Us" />

    <Route component={NotFoundPage} />
</Switch>
);

export default Routes;
