import settings from "settings";
import Authorize from "core/auth/authorize";
import { isPageAvailableAuthorizedOnly } from "core/auth";
import View from "stores/view-store";

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
    PAYMENTS_ACC_COMMON   : v1 + "/payments/bookings/account",
    PAYMENTS_CALLBACK     : v1 + "/payments/callback",

    ACCOUNT_BALANCE       : currencyCode =>
                            v1 + `/payments/accounts/balance/${currencyCode}`,

    USER                  : v1 + "/agents",
    USER_REGISTRATION     : v1 + "/agents/register",
    USER_REGISTRATION_M   : v1 + "/agents/register/master",

    USER_INVITE_DATA      : invitationCode =>
                            v1 + "/agents/invitations/" + invitationCode,
    USER_INVITE_SEND      : v1 + "/agents/invitations/send",
    USER_INVITE_GET_LINK  : v1 + "/agents/invitations",

    ACCOMMODATION_BOOKING : v1 + "/accommodations/bookings",
    A_BOOKING_FINALIZE    : referenceCode =>
                            v1 + `/accommodations/bookings/${referenceCode}/finalize`,

    BOOKING_LIST          : v1 + "/accommodations/bookings/agent",
    BOOKING_CANCEL        : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}/cancel`,
    BOOKING_VOUCHER       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/voucher/send`,
    BOOKING_INVOICE       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/invoice/send`,
    BOOKING_GET_BY_ID     : bookingId =>
                            v1 + `/accommodations/bookings/${bookingId}`,
    BOOKING_GET_BY_CODE   : referenceCode =>
                            v1 + `/accommodations/bookings/refcode/${referenceCode}`,

    ACCOMMODATION_DETAILS : (accommodationId, source) =>
                            v1 + `/${source}/accommodations/${accommodationId}`,
    A_SEARCH_ONE_CREATE   : v1 + "/availabilities/accommodations/searches",
    A_SEARCH_ONE_CHECK    : searchId =>
                            v1 + `/availabilities/accommodations/searches/${searchId}/state`,
    A_SEARCH_ONE_RESULT   : searchId =>
                            v1 + `/availabilities/accommodations/searches/${searchId}`,
    A_SEARCH_STEP_TWO     : (availabilityId, accommodationId, source) =>
                            v1 + `/${source}/accommodations/${accommodationId}/availabilities/${availabilityId}`,
    A_SEARCH_STEP_THREE   : (availabilityId, roomContractSetId, source) =>
                            v1 + `/${source}/accommodations/availabilities/${availabilityId}/room-contract-sets/${roomContractSetId}`,
    REQUEST_DEADLINE      : (availabilityId, roomContractSetId, source) =>
                            v1 + `/${source}/accommodations/availabilities/${availabilityId}/room-contract-sets/${roomContractSetId}/deadline`,


    BILLING_HISTORY       : counterpartyId =>
                            v1 + `/payments/history/${counterpartyId}`,

    BASE_VERSION          : v1 + "/versions",

    DIRECT_LINK_PAY : {
        SETTINGS     :         v1 + "/external/payment-links/tokenization-settings",
        GET_INFO     : code => v1 + "/external/payment-links/" + code,
        SIGN         : code => v1 + "/external/payment-links/" + code + "/sign",
        PAY          : code => v1 + "/external/payment-links/" + code + "/pay",
        PAY_CALLBACK : code => v1 + "/external/payment-links/" + code + "/pay/callback"
    },

    AGENCY_AGENTS        : agencyId =>
                           v1 + `/agencies/${agencyId}/agents`,
    AGENCY_AGENT         : (agencyId, agentId) =>
                           v1 + `/agencies/${agencyId}/agents/${agentId}`,
    COUNTERPARTY_INFO    : counterpartyId =>
                           v1 + `/counterparties/${counterpartyId}`,
    AGENT_SETTINGS       : v1 + `/agents/settings/application`,
    ALL_PERMISSIONS      : v1 + "/all-permissions-list",
    AGENT_PERMISSIONS    : (agentId, agencyId, counterpartyId = 1) =>
                           v1 + `/counterparties/${counterpartyId}/agencies/${agencyId}/agents/${agentId}/permissions`,

    OUR_COMPANY          : v1 + "/company"
};



/*^~^~^~^~^~^~^~^~^~^~^~~^~^~^~^~^*/



let _ = API_METHODS;

_.methods_dont_show_error = [
    _.USER,
    _.PAYMENTS_CARD_NEW
];

_.request = ({
    url, external_url,
    body = {},
    method = "GET",
    response, // function(response)                - Fires first
    success,  // function(result)                  - Fires second on success
    error,    // function(error)                   - Fires second on error,
    after     // function(result, error, response) - Fires the last
}) => {
Authorize.getUser().then(user => {
    if (!external_url && !user?.access_token) {
        if (isPageAvailableAuthorizedOnly())
            Authorize.signinRedirect();
        return;
    }

    var finalUrl = url || external_url,
        request = {
            method: method,
            headers: new Headers({
                ...(external_url ? {} : {
                    'Authorization': `Bearer ${user.access_token}`
                }),
                'Content-Type': 'application/json'
            })
        };

    if ("POST" == method || "PUT" == method)
        request.body = JSON.stringify(body);
    else {
        var getBody = Object.keys(body).map(key =>
            [key, body[key]].map(encodeURIComponent).join("=")
        ).join("&");
        finalUrl += (getBody ? "?" + getBody : "");
    }

    var rawResponse = null,
        failed = false;
    fetch(finalUrl, request)
        .then(res => {
            rawResponse = res;
            failed = !res || (res && res.status >= 300);
            if (response)
                response(res);
            return res.text().then(text => {
                return text ? JSON.parse(text) : {}
            });
        })
        .then(
            (result) => {
                if ((rawResponse.status == 401 || rawResponse.status == 403) && isPageAvailableAuthorizedOnly()) {
                    Authorize.signinRedirect();
                    return;
                }
                if (failed) {
                    if (_.methods_dont_show_error.indexOf(url) < 0 && result && result.status >= 400 && result.detail)
                        View.setTopAlertText(result.detail);
                    if (error)
                        error(result);
                } else {
                    View.setTopAlertText(null);
                    if (success)
                        success(result);
                }
                if (after)
                    after(
                        failed ? null : result,
                        failed ? result :  null,
                        rawResponse
                    );
            },
            (err) => {
                if (error)
                    error(err);
                if (after)
                    after(null, err, rawResponse);
            }
        );
});
};

_.get = (params) => {
    _.request({
        method: "GET",
        ...params
    })
};

_.post = (params) => {
    _.request({
        method: "POST",
        ...params
    })
};

_.put = (params) => {
    _.request({
        method: "PUT",
        ...params
    })
};

export default _;
