import settings from "settings";

const v1 = settings.edo(settings.default_culture), //todo : select current culture



API_METHODS = {

    BASE_REGIONS: v1 + "/locations/regions",
    BASE_CURRENCIES: v1 + "/payments/currencies",

    COUNTRIES_PREDICTION: v1 + "/locations/countries",
    LOCATION_PREDICTION: v1 + "/locations/predictions",

    ACCOMMODATION_SEARCH: v1 + "/availabilities/accommodations",
    ACCOMMODATION_BOOKING: v1 + "/bookings/accommodations"

};



/*^~^~^~^~^~^~^~^~^~^~^~~^~^~^~^~^*/



let _ = API_METHODS;

_.methods_with_cache = [
    _.BASE_REGIONS,
    _.BASE_CURRENCIES
];

_.methods_with_languageCode = [
    _.BASE_REGIONS,
    _.COUNTRIES_PREDICTION,
    _.LOCATION_PREDICTION
];

_.request = ({
    url,
    body,
    method = "GET",
    response, // function(response)                - Fires first
    success,  // function(result)                  - Fires second on success
    error,    // function(error)                   - Fires second on error,
    after     // function(result, error, response) - Fires the last
}) => {
    var finalUrl = url,
        request = {
            method: method,
            headers:{
                'Content-Type': 'application/json'
            }
        };

    if (_.methods_with_languageCode)
        body = {
            ...body,
            languageCode: "en" //todo : get language code
        };

    if ("POST" == method)
        request.body = JSON.stringify(body);
    else
        finalUrl = url + "?" + Object.keys(body).map(function(key) {
            return [key, body[key]].map(encodeURIComponent).join("=");
        }).join("&");

    // todo: cache

    var rawResponse = null;
    fetch(finalUrl, request)
        .then(res => {
            rawResponse = res;
            if (response)
                response(res);
            return res.json();
        })
        .then(
            (result) => {
                if (success)
                    success(result);
                if (after)
                    after(result, null, rawResponse);
            },
            (err) => {
                if (error)
                    error(err);
                console.error(err);
                console.log(rawResponse);
                if (after)
                    after(null, err, rawResponse);
            }
        );
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

export default _;
