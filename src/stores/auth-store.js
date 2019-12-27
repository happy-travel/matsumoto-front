import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { RenderTheApp } from "../";

class AuthStore {
    @observable registration = {
        "customer": {},
        "company": {}
    };

    @observable userCache = null;

    constructor() {
        autosave(this, "_auth_store_cache");
    }

    setUserForm(form) {
        this.registration.customer = form;
    }

    setCompanyForm(form) {
        this.registration.company = form;
        if (this.registration.company.phone)
            this.registration.company.phone = this.registration.company.phone.replace(/\D/g,''); //todo: make decorators
    }

    setCountryValue(country) {
        this.registration.company.countryCode = country.code;
    }

    setUserCache(newUserCache) {
        var rerenderNeeded = this.userCache?.access_token != newUserCache?.access_token;
        this.userCache = newUserCache;
        if (rerenderNeeded)
            RenderTheApp();
    }
}

export default new AuthStore();
