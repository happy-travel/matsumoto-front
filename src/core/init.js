import Authorize from "./auth/authorize";
import React from "react";
import { isPageAvailableAuthorizedOnly, userAuthSetToStorage } from "core/auth";
import { API, getParams } from "core";
import dropdownToggler from "components/form/dropdown/toggler";
import { loadUserSettings } from "simple/logic/user-settings";

import UI from "stores/ui-store";
import authStore from "stores/auth-store";

export const initApplication = () => {
    if (window.location.href.indexOf("/auth/") > 0)
        return;

    if (window.location.pathname.length < 2 && // index page
        getParams().code) { // and auth
        if (getParams().invCode)
            window.sessionStorage.setItem("_auth__invCode", getParams().invCode);
    }

    dropdownToggler();
};

export const initUser = () => {
    API.get({
        url: API.USER,
        success: (result) => {
            if (result?.email)
                authStore.setUser(result);
        },
        after: (user, error, response) => {
            if (!response)
                return;
            if (response.status == 401 || response.status == 403) {
                if (isPageAvailableAuthorizedOnly())
                    Authorize.signinRedirect();
                return;
            }
            if (response.status == 400 && "Could not get agent data" == error?.detail) {
                if (isPageAvailableAuthorizedOnly())
                    window.location.href = window.location.origin + "/signup/agent";
            } else
                userAuthSetToStorage(user);
        }
    });

    loadUserSettings();

    API.get({
        url: API.BASE_VERSION,
        success: (result) => {
            if (UI.currentAPIVersion != result) {
                API.get({
                    url: API.BASE_REGIONS,
                    success: (result) => UI.setRegions(result)
                });
                API.get({
                    url: API.BASE_CURRENCIES,
                    success: (result) => UI.setCurrencies(result)
                });
                API.get({
                    url: API.OUR_COMPANY,
                    success: (result) => UI.setOurCompanyInfo(result)
                });
            }
            UI.setCurrentAPIVersion(result)
        }
    });
};
