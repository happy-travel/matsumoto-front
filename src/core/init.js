import UI from "stores/ui-store";
import authStore from "stores/auth-store";
import { API } from "core";
import Authorize from "./auth/authorize";
import React from "react";
import { getParams } from "core";
import dropdownToggler from "components/form/dropdown/toggler";

const noRedirectPages = ["/contact", "/terms", "/privacy", "/about", "/signup/", "/pay", "/logout"];

export const isRedirectNeeded = () => noRedirectPages.every(item => window.location.href.indexOf(item) == -1);

const init = () => {
    if (window.location.href.indexOf("/auth/") > 0)
        return;

    if (window.location.pathname.length < 2 && // index page
        getParams().code) { // and auth
        if (getParams().invCode)
            window.sessionStorage.setItem("_auth__invCode", getParams().invCode);
    }

    API.get({
        url: API.USER,
        success: (result) => {
            if (result?.email)
                authStore.setUser(result);
        },
        after: (a, error, response) => {
            if (!response)
                return;
            if (response.status == 401 || response.status == 403) {
                if (isRedirectNeeded())
                    Authorize.signinRedirect();
                return;
            }
            if (response.status == 400 && "Could not get agent data" == error?.detail) {
                if (isRedirectNeeded())
                    window.location.href = window.location.origin + "/signup/user";
            } else
                authStore.setCachedUserRegistered(true);
        }
    });

    API.get({
        url: API.AGENT_SETTINGS,
        success: (result) => {
            authStore.setSettings(result);
        }
    });

    if (!UI.isAppInitialized) {
        API.get({
            url: API.BASE_REGIONS,
            success: (result) =>
                UI.setRegions(result),
            after: () =>
                UI.setInitialized(true)
        });
        API.get({
            url: API.BASE_CURRENCIES,
            success: (result) =>
                UI.setCurrencies(result)
        });
    }
    API.get({
        url: API.BASE_VERSION,
        success: (result) =>
            UI.setCurrentAPIVersion(result)
    });

    dropdownToggler();
};

export default init;