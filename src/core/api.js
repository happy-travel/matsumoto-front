import fetch from "./misc/fetch";

const API_METHODS = {
    BASE_REGIONS          : "/locations/regions",
    BASE_CURRENCIES       : "/payments/currencies",

    COUNTRIES_PREDICTION  : "/locations/countries",

    CARDS_SAVED           : "/cards",
    CARDS_SETTINGS        : "/cards/settings",
    CARDS_SIGN            : "/cards/signatures/calculate",
    PAYMENTS_CARD_NEW     : "/payments/accommodations/bookings/cards/new/pay",
    PAYMENTS_CARD_SAVED   : "/payments/accommodations/bookings/cards/saved/pay",
    PAYMENTS_CALLBACK     : "/payments/callback",
    BOOK_BY_ACCOUNT       : "/accommodations/bookings/book-by-account",
    BOOK_FOR_OFFLINE      : "/accommodations/bookings/book-for-offline",
    CARDS_REMOVE          : cardId =>
                            `/cards/${cardId}`,

    ACCOUNT_BALANCE       : currencyCode =>
                            `/agency-accounts/currencies/${currencyCode}/balance`,

    AGENT                 : "/agent",
    AGENT_REGISTER        : "/agent/register",
    AGENCY_REGISTER       : "/agency/child-agencies/register",
    AGENT_REGISTER_MASTER : "/agent/register-master",
    AGENT_PROPERTIES      : "/agent/properties",
    INVITATION_DATA       : invitationCode =>
                            `/invitations/${invitationCode}`,
    AGENT_INVITE_SEND     : "/agent/invitations/send",
    AGENT_INVITE_GENERATE : "/agent/invitations/generate",
    AGENT_INVITE_RESEND   : invitationId =>
                            `/agent/invitations/${invitationId}/resend`,
    AGENT_INVITE_DISABLE  : invitationId =>
                            `/agent/invitations/${invitationId}/disable`,
    AGENT_INVITATIONS     : "/agent/invitations/not-accepted",
    AGENT_ACCEPTED_INVITES: "/agent/invitations/accepted",
    AGENCY_INVITATIONS    : "/agency/invitations/not-accepted",
    AGENCY_ACCEPTED_INVITES: "/agency/invitations/accepted",
    AGENCY_ACCOUNTS       : "/agency-accounts",
    AGENT_ALL_ROLES       : "/agent-roles",
    // ALL_PERMISSIONS    : "/all-permissions-list", // todo: is it legacy?

    CHILD_AGENCY          : agencyId =>
                            `/agency/child-agencies/${agencyId}`,
    CHILD_AGENCIES        : "/agency/child-agencies",
    CHILD_AGENCY_INVITE_SEND: "/agency/child-agencies/invitations/send",
    CHILD_AGENCY_INVITE_GENERATE: "/agency/child-agencies/invitations/generate",
    CHILD_AGENCY_MARKUPS  : agencyId =>
                            `/agency/child-agencies/${agencyId}/markup-policies`,
    CHILD_AGENCY_MARKUP   : (agencyId, policyId) =>
                            `/agency/child-agencies/${agencyId}/markup-policies/${policyId}`,
    CHILD_AGENCY_ACTIVATE : agencyId =>
                            `/agency/child-agencies/${agencyId}/activate`,
    CHILD_AGENCY_DEACTIVATE: agencyId =>
                            `/agency/child-agencies/${agencyId}/deactivate`,
    CHILD_AGENCY_TRANSFER_ACCOUNT_FUNDS: (payerAccountId, recipientAccountId) =>
                            `/agency-accounts/${payerAccountId}/transfer/${recipientAccountId}`,


    ACCOMMODATION_BOOKING : "/accommodations/bookings",
    A_BOOKING_FINALIZE    : referenceCode =>
                            `/accommodations/bookings/${referenceCode}/finalize`,

    BOOKING_LIST          : "/accommodations/bookings/agent",
    BOOKING_CANCEL        : bookingId =>
                            `/accommodations/bookings/${bookingId}/cancel`,
    BOOKING_PENALTY       : bookingId =>
                            `/accommodations/bookings/${bookingId}/cancellation-penalty`,
    BOOKING_STATUS        : bookingId =>
                            `/accommodations/bookings/${bookingId}/refresh-status`,
    BOOKING_INVOICE       : bookingId =>
                            `/accommodations/bookings/${bookingId}/supporting-documents/invoice`,
    BOOKING_INVOICE_SEND  : bookingId =>
                            `/accommodations/bookings/${bookingId}/supporting-documents/invoice/send`,
    BOOKING_VOUCHER       : bookingId =>
                            `/accommodations/bookings/${bookingId}/supporting-documents/voucher`,
    BOOKING_VOUCHER_SEND  : bookingId =>
                            `/accommodations/bookings/${bookingId}/supporting-documents/voucher/send`,
    BOOKING_GET_BY_ID     : bookingId =>
                            `/accommodations/bookings/${bookingId}`,
    BOOKING_GET_BY_CODE   : referenceCode =>
                            `/accommodations/bookings/refcode/${referenceCode}`,
    BOOKING_PAY_WITH_CARD : referenceCode =>
                            `/accommodations/bookings/refcode/${referenceCode}/pay-with-credit-card`,

    AGENCY_BOOKINGS_LIST  : "/accommodations/bookings/agency",

    ACCOMMODATION_DETAILS : (searchId, htId) =>
                            `/accommodations/availabilities/searches/${searchId}/results/${htId}/accommodation `,
    A_SEARCH_ONE_CREATE   : "/accommodations/availabilities/searches",
    A_SEARCH_ONE_CHECK    : searchId =>
                            `/accommodations/availabilities/searches/${searchId}/state`,
    A_SEARCH_ONE_RESULT   : searchId =>
                            `/accommodations/availabilities/searches/${searchId}`,
    A_SEARCH_TWO_CHECK    : (searchId, htId) =>
                            `/accommodations/availabilities/searches/${searchId}/results/${htId}/state`,
    A_SEARCH_TWO_RESULT   : (searchId, htId) =>
                            `/accommodations/availabilities/searches/${searchId}/results/${htId}`,
    A_SEARCH_STEP_THREE   : (searchId, htId, roomContractSetId) =>
                            `/accommodations/availabilities/searches/${searchId}/results/${htId}/room-contract-sets/${roomContractSetId}`,
    REQUEST_DEADLINE      : (searchId, htId, roomContractSetId) =>
                            `/accommodations/availabilities/searches/${searchId}/results/${htId}/room-contract-sets/${roomContractSetId}/deadline`,

    PAYMENTS_HISTORY      : `/agent/payments-history`,

    BASE_VERSION          : "/versions",

    DIRECT_LINK_PAY : {
        SETTINGS     :         "/external/payment-links/tokenization-settings",
        GET_INFO     : code => "/external/payment-links/" + code,
        SIGN         : code => "/external/payment-links/" + code + "/sign",
        PAY          : code => "/external/payment-links/" + code + "/pay",
        PAY_CALLBACK : code => "/external/payment-links/" + code + "/pay/callback"
    },

    AGENCY               : `/agency`,
    AGENCY_AGENTS        : `/agency/agents`,
    AGENCY_AGENT         : agentId =>
                           `/agency/agents/${agentId}`,
    AGENT_ENABLE         : agentId =>
                           `/agency/agents/${agentId}/enable`,
    AGENT_DISABLE        : agentId =>
                           `/agency/agents/${agentId}/disable`,
    AGENCY_BANNER        : "/agency/images/banner",
    AGENCY_LOGO          : "/agency/images/logo",
    COUNTERPARTY_INFO    : "/counterparty",
    COUNTERPARTY_FILE    : "/counterparty/contract-file",
    COMPANY_INFO         : "/company",
    AGENT_SETTINGS       : "/agent/settings/application",
    AGENT_PERMISSIONS    : agentId =>
                           `/agency/agents/${agentId}/permissions`, // todo: is it legacy?
    AGENT_ROLES          : agentId =>
                           `/agency/agents/${agentId}/roles`,
    AGENCY_APR_SETTINGS  : `/agency/system-settings/apr-settings`,
    AGENCY_PAYMENT_OPTION: `/agency/system-settings/displayed-payment-options`,
    MARKUP_TEMPLATES     : "/markup-templates",
    AGENT_MARKUPS        : agentId =>
                           `/agency/agents/${agentId}/markup-policies`,
    AGENT_MARKUP         : (agentId, policyId) =>
                           `/agency/agents/${agentId}/markup-policies/${policyId}`,

    REPORT_DUPLICATE     : "/accommodations-mapping/duplicate-reports",

    OUR_COMPANY          : "/company",

    OSAKA_LOCATION_PREDICTION : "/predictions",
};

API_METHODS.methods_dont_show_error = [
    API_METHODS.AGENT_SETTINGS,
    API_METHODS.BASE_VERSION,
    API_METHODS.BASE_REGIONS,
    API_METHODS.BASE_CURRENCIES,
    API_METHODS.OUR_COMPANY,
    "/state"
];

export default fetch(API_METHODS);
