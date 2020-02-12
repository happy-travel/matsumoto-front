import UI from "stores/ui-store";
import authStore from "stores/auth-store";
import { API } from "core";
import Authorize from "./auth/authorize";
import React from "react";
import { getParams } from "core";
import dropdownToggler from "components/form/dropdown/toggler";

const noRedirectPages = ["/contact", "/terms", "/privacy", "/about", "/signup/", "/pay"];

export const isRedirectNeeded = () => noRedirectPages.every(item => window.location.href.indexOf(item) == -1);

const init = () => {
    if (window.location.href.indexOf("/auth/") > 0)
        return;

    if (window.location.pathname.length < 2 && // index page
        getParams().code) { // and auth
        if (getParams().invCode)
            window.sessionStorage.setItem("_auth__invCode", getParams().invCode);
        else
            window.sessionStorage.removeItem("_auth__invCode");
    }

    API.get({
        url: API.USER,
        success: (result) => {
            if (result?.email)
                UI.setUser(result);
        },
        after: (a, b, response) => {
            if (!response)
                return;
            if (response.status == 401) {
                if (isRedirectNeeded())
                    Authorize.signinRedirect();
                return;
            }
            if (response.status != 200) {
                if (isRedirectNeeded())
                    window.location.href = window.location.origin + "/signup/user";
                //todo: make normal redirect
            } else
                authStore.setCachedUserRegistered(true);
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

    dropdownToggler();

};

export default init;