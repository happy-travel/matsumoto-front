import settings from "settings";
import fetch from "./misc/fetch";

const v1 = settings.edo(settings.default_culture), //todo : select current culture

API_METHODS = {

    BASE_REGIONS          : v1 + "/locations/regions",
    BASE_CURRENCIES       : v1 + "/payments/currencies",

    COUNTRIES_PREDICTION  : v1 + "/locations/countries",
    LOCATION_PREDICTION   : v1 + "/locations/predictions",

    CARDS_SAVED           : v1 + "/cards",
    CARDS_SETTINGS        : v1 + "/cards/settings",
    CARDS_SIGN            : v1 + "/cards/signatures",
    PAYMENTS_CARD_NEW     : v1 + "/payments/bookings/card/new",
    PAYMENTS_CARD_SAVED   : v1 + "/payments/bookings/card/saved",
    PAYMENTS_CALLBACK     : v1 + "/payments/callback",
    BOOK_BY_ACCOUNT       : v1 + "/accommodations/bookings/book-by-account",
    CARDS_REMOVE          : cardId =>
                            v1 + `/cards/${cardId}`,

    ACCOUNT_BALANCE       : currencyCode =>
                            v1 + `/payments/accounts/balance/${currencyCode}`,

    AGENT                 : v1 + "/agent",
    AGENT_REGISTER        : v1 + "/agent/register",
    AGENT_REGISTER_MASTER : v1 + "/agent/register-master",
    AGENT_PROPERTIES      : v1 + "/agent/properties",
    AGENT_INVITE_DATA     : invitationCode =>
                            v1 + "/agent/invitations/" + invitationCode,
    AGENT_INVITE_SEND     : v1 + "/agent/invitations/send",
    AGENT_INVITE_GENERATE : v1 + "/agent/invitations/generate",
    AGENT_INVITE_RESEND   : invitationId =>
                            v1 + `/agent/invitations/${invitationId}/resend`,
    AGENT_INVITATIONS     : v1 + "/agent/invitations",
    AGENCY_INVITATIONS    : v1 + "/agency/invitations",

    ACCOMMODATION_BOOKING : v1 + "/accommodations/bookings",
    A_BOOKING_FINALIZE    : referenceCode =>
                            v1 + `/accommodations/bookings/${referenceCode}/finalize`,

    BOOKING_LIST          : v1 + "/accommodations/bookings/agent",
    BOOKING_CANCEL        : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}/cancel`,
    BOOKING_PENALTY       : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}/cancellation-penalty`,
    BOOKING_STATUS        : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}/refresh-status`,
    BOOKING_INVOICE       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/invoice`,
    BOOKING_INVOICE_SEND  : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/invoice/send`,
    BOOKING_VOUCHER       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/voucher`,
    BOOKING_VOUCHER_SEND  : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/voucher/send`,
    BOOKING_GET_BY_ID     : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}`,
    BOOKING_GET_BY_CODE   : referenceCode =>
                            v1 + `/accommodations/bookings/refcode/${referenceCode}`,

    AGENCY_BOOKINGS_LIST  : v1 + "/accommodations/bookings/agency",

    ACCOMMODATION_DETAILS : (searchId, resultId) =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/results/${resultId}/accommodation `,
    A_SEARCH_ONE_CREATE   : v1 + "/accommodations/availabilities/searches",
    A_SEARCH_ONE_CHECK    : searchId =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/state`,
    A_SEARCH_ONE_RESULT   : searchId =>
                            v1 + `/accommodations/availabilities/searches/${searchId}`,
    A_SEARCH_TWO_CHECK    : (searchId, resultId) =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/results/${resultId}/state`,
    A_SEARCH_TWO_RESULT   : (searchId, resultId) =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/results/${resultId}`,
    A_SEARCH_STEP_THREE   : (searchId, resultId, roomContractSetId) =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/results/${resultId}/room-contract-sets/${roomContractSetId}`,
    REQUEST_DEADLINE      : (searchId, resultId, roomContractSetId) =>
                            v1 + `/accommodations/availabilities/searches/${searchId}/results/${resultId}/room-contract-sets/${roomContractSetId}/deadline`,

    PAYMENTS_HISTORY      : v1 + `/agent/payments-history`,

    BASE_VERSION          : v1 + "/versions",

    DIRECT_LINK_PAY : {
        SETTINGS     :         v1 + "/external/payment-links/tokenization-settings",
        GET_INFO     : code => v1 + "/external/payment-links/" + code,
        SIGN         : code => v1 + "/external/payment-links/" + code + "/sign",
        PAY          : code => v1 + "/external/payment-links/" + code + "/pay",
        PAY_CALLBACK : code => v1 + "/external/payment-links/" + code + "/pay/callback"
    },

    AGENCY_AGENTS        : v1 + `/agency/agents`,
    AGENCY_AGENT         : agentId =>
                           v1 + `/agency/agents/${agentId}`,
    AGENT_ENABLE         : agentId =>
                           v1 + `/agency/agents/${agentId}/enable`,
    AGENT_DISABLE        : agentId =>
                           v1 + `/agency/agents/${agentId}/disable`,
    AGENCY_BANNER        : v1 + "/agency/images/banner",
    AGENCY_LOGO          : v1 + "/agency/images/logo",
    COUNTERPARTY_INFO    : v1 + "/counterparty",
    COUNTERPARTY_FILE    : v1 + "/counterparty/contract-file",
    AGENT_SETTINGS       : v1 + "/agent/settings/application",
    ALL_PERMISSIONS      : v1 + "/all-permissions-list",
    AGENT_PERMISSIONS    : agentId =>
                           v1 + `/agency/agents/${agentId}/permissions`,
    AGENCY_APR_SETTINGS  : v1 + `/agency/system-settings/apr-settings`,
    AGENCY_PAYMENT_OPTION: v1 + `/agency/system-settings/displayed-payment-options`,

    REPORT_DUPLICATE     : v1 + "/accommodations-mapping/duplicate-reports",

    OUR_COMPANY          : v1 + "/company"
};

API_METHODS.methods_dont_show_error = [
    API_METHODS.AGENT_SETTINGS,
    API_METHODS.BASE_VERSION,
    API_METHODS.BASE_REGIONS,
    API_METHODS.BASE_CURRENCIES,
    API_METHODS.OUR_COMPANY
];

export default fetch(API_METHODS);
