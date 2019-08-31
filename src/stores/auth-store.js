import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";

class AuthStore {
    @observable registration = {
        "masterCustomer": {},
        "company": {}
    };

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_auth_store_cache");
    }

    setUserForm(form) {
        this.registration.masterCustomer = form;
    }

    setCompanyForm(form) {
        this.registration.company = form;
    }
}

export default new AuthStore();