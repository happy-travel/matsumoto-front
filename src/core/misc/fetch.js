import Authorize from "core/auth/authorize";
import { isPageAvailableAuthorizedOnly } from "core/auth";
import { $notifications } from "stores";

export default api => {
    const showError = (err, url = "") => {
        if (api.methods_dont_show_error.includes(url) || url?.includes("/state"))
            return;
        if (typeof err.detail == "string")
            return $notifications.addNotification(err.detail);
        if (typeof err.title == "string")
            return $notifications.addNotification(err.title, "Server error");
        if (typeof err == "string")
            return $notifications.addNotification(err, "Server message");
        $notifications.addNotification("Server Request Error");
    };

    api.request = ({
        url, external_url,
        body = {}, formDataBody,
        method = "GET",
        response, // function(response)                - Fires first
        success,  // function(result)                  - Fires second on success
        error,    // function(error)                   - Fires second on error,
        after     // function(result, error, response) - Fires the last
    }) => new Promise((resolve, reject) => {
        Authorize.getUser().then(user => {
            if (!external_url && !user?.access_token) {
                if (isPageAvailableAuthorizedOnly())
                    Authorize.signinRedirect();
                reject();
                return;
            }

            var finalUrl = url || external_url,
                request = {
                    method: method,
                    headers: new Headers({
                        ...(external_url ? {} : {
                            'Authorization': `Bearer ${user.access_token}`
                        }),
                        ...(formDataBody ? {} : {
                            'Content-Type': 'application/json'
                        })
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

            if (formDataBody)
                request.body = formDataBody;

            var rawResponse = null,
                failed = false;
            fetch(finalUrl, request)
                .then(
                    res => {
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
                                } catch (e) {
                                    value = text;
                                }
                            }
                            return value;
                        });
                    },
                    error => {
                        showError(error, url);
                        reject(error);
                    }
                )
                .then(
                    (result) => {
                        if (!rawResponse?.status) {
                            reject(null);
                            return;
                        }
                        if ((rawResponse.status == 401) && isPageAvailableAuthorizedOnly()) {
                            Authorize.signinRedirect();
                            reject(null);
                            return;
                        }
                        if (rawResponse.status == 403) {
                            showError("Sorry, you don`t have enough permissions", url);
                            if (error)
                                error(result);
                            if (after)
                                after(null, null, rawResponse);
                            reject(result);
                            return;
                        }
                        if (failed) {
                            if (result && result.status >= 400)
                                showError(result, url);
                            if (error)
                                error(result);
                        } else {
                            if (success)
                                success(result);
                        }
                        if (after)
                            after(
                                failed ? null : result,
                                failed ? result : null,
                                rawResponse
                            );
                        if (!failed)
                            resolve(result);
                        else
                            reject(result);
                    },
                    (err) => {
                        if (error)
                            error(err);
                        else
                            showError(err);
                        if (after)
                            after(null, err, rawResponse);
                        reject(err);
                    }
                );
            }
        );
    });

    api.get = (params) =>
        api.request({
            method: "GET",
            ...params
        });

    api.post = (params) =>
        api.request({
            method: "POST",
            ...params
        });

    api.put = (params) =>
        api.request({
            method: "PUT",
            ...params
        });

    api.delete = (params) =>
        api.request({
            method: "DELETE",
            ...params
        });

    return api;
};
