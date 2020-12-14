import settings from "settings";
import Authorize from "core/auth/authorize";
import { isPageAvailableAuthorizedOnly } from "core/auth";
import Notifications from "stores/notifications-store";

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
    BOOKING_VOUCHER       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/voucher/send`,
    BOOKING_INVOICE       : bookingId =>
                            v1 + `/accommodations/supporting-documentation/${bookingId}/invoice/send`,
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

    BILLING_HISTORY       : v1 + `/payments/history/agent`,

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



/*^~^~^~^~^~^~^~^~^~^~^~~^~^~^~^~^*/



let _ = API_METHODS;

_.methods_dont_show_error = [
    _.AGENT_SETTINGS,
    _.BASE_VERSION, _.BASE_REGIONS, _.BASE_CURRENCIES, _.OUR_COMPANY
];

const showError = (text, url = "") => ((
    _.methods_dont_show_error.indexOf(url) < 0 &&
    (!url || (url?.indexOf("/state") < 0))
) && Notifications.addNotification(text));

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

    if (["POST", "PUT", "DELETE"].includes(method))
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
            if (response) {
                response(res);
                return;
            }
            return res.text().then(text => {
                var value = null;
                if (text) {
                    try {
                        value = JSON.parse(text);
                    }
                    catch (e) {
                        value = text;
                    }
                }
                return value;
            });
        })
        .then(
            (result) => {
                if ((rawResponse.status == 401) && isPageAvailableAuthorizedOnly()) {
                    Authorize.signinRedirect();
                    return;
                }
                if (rawResponse.status == 403) {
                    showError("Sorry, you don`t have enough permissions", url);
                    if (error)
                        error(result);
                    if (after)
                        after(null, null, rawResponse);
                    return;
                }
                if (failed) {
                    if (result && result.status >= 400 && result.detail)
                        showError(result.detail, url);
                    if (error)
                        error(result);
                } else {
                    showError(null, url);
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

_.delete = (params) => {
    _.request({
        method: "DELETE",
        ...params
    })
};

export default _;
