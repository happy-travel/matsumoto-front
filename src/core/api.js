import settings from "settings";
import Authorize from "core/auth/authorize";
import View from "stores/view-store";
import authStore from "stores/auth-store";
import { isRedirectNeeded } from "./init";

const v1 = settings.edo(settings.default_culture), //todo : select current culture


API_METHODS = {

    BASE_REGIONS          : v1 + "/locations/regions",
    BASE_CURRENCIES       : v1 + "/payments/currencies",

    COUNTRIES_PREDICTION  : v1 + "/locations/countries",
    LOCATION_PREDICTION   : v1 + "/locations/predictions",

    CARDS_COMMON          : v1 + "/cards",
    CARDS_SETTINGS        : v1 + "/cards/settings",
    CARDS_SIGN            : v1 + "/cards/signatures",
    PAYMENTS_CARD_COMMON  : v1 + "/payments/bookings/card",
    PAYMENTS_ACC_COMMON   : v1 + "/payments/bookings/account",
    PAYMENTS_CALLBACK     : v1 + "/payments/callback",

    ACCOUNT_BALANCE       : currencyCode =>
                            v1 + `/payments/accounts/balance/${currencyCode}`,

    USER                  : v1 + "/customers",
    USER_REGISTRATION     : v1 + "/customers/register",
    USER_REGISTRATION_M   : v1 + "/customers/register/master",

    USER_INVITE_DATA      : invitationCode =>
                            v1 + "/customers/invitations" + "/" + invitationCode,
    USER_INVITE_SEND      : v1 + "/customers/invitations/send",
    USER_INVITE_GET_LINK  : v1 + "/customers/invitations",

    ACCOMMODATION_BOOKING : v1 + "/accommodations/bookings",
    A_BOOKING_FINALIZE    : referenceCode =>
                            v1 + `/accommodations/bookings/${referenceCode}/finalize`,

    BOOKING_LIST          : v1 + "/accommodations/bookings/customer",
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

    A_SEARCH_STEP_ONE     : v1 + "/availabilities/accommodations",
    A_SEARCH_STEP_TWO     : (availabilityId, accommodationId, source) =>
                            v1 + `/${source}/accommodations/${accommodationId}/availabilities/${availabilityId}`,
    A_SEARCH_STEP_THREE   : (availabilityId, agreementId, source) =>
                            v1 + `/${source}/accommodations/availabilities/${availabilityId}/agreements/${agreementId}`,

    BILLING_HISTORY       : companyId =>
                            v1 + `/payments/history/${companyId}`,

    BASE_VERSION          : v1 + "/versions",

    DIRECT_LINK_PAY : {
        SETTINGS     :         v1 + "/external/payment-links/tokenization-settings",
        GET_INFO     : code => v1 + "/external/payment-links/" + code,
        SIGN         : code => v1 + "/external/payment-links/" + code + "/sign",
        PAY          : code => v1 + "/external/payment-links/" + code + "/pay",
        PAY_CALLBACK : code => v1 + "/external/payment-links/" + code + "/pay/callback"
    },

    COMPANY_BRANCH_CUSTOMERS    : (companyId, branchId) =>
                           v1 + `/companies/${companyId}/branches/${branchId}/customers`,
    COMPANY_CUSTOMERS    : (companyId) =>
                           v1 + `/companies/${companyId}/customers`,
    COMPANY_CUSTOMER    : (companyId, customerId) =>
                           v1 + `/companies/${companyId}/customers/${customerId}`,

    CUSTOMER_PERMISSIONS: (companyId, customerId) =>
        v1 + `/companies/${companyId}/customers/${customerId}/permissions`,
    CUSTOMER_BRANCH_PERMISSIONS: (companyId, customerId, branchId) =>
        v1 + `/companies/${companyId}/branches/${branchId}/customers/${customerId}/permissions`,
};



/*^~^~^~^~^~^~^~^~^~^~^~~^~^~^~^~^*/



let _ = API_METHODS;

_.methods_with_cache = [
    _.BASE_REGIONS,
    _.BASE_CURRENCIES
];

_.methods_dont_show_error = [
    _.USER
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
    if (!external_url && isRedirectNeeded())
        authStore.setUserCache(user);
    if (!external_url && !user?.access_token) {
        if (isRedirectNeeded())
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

    if ("POST" == method  || method === "PUT")
        request.body = JSON.stringify(body);
    else {
        var getBody = Object.keys(body).map(function(key) {
            return [key, body[key]].map(encodeURIComponent).join("=");
        }).join("&");
        finalUrl += (getBody ? "?" + getBody : "");
    }

    // todo: cache

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
                if (rawResponse.status == 401 && isRedirectNeeded()) {
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
