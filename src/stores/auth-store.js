import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";

class AuthStore {
    @observable registration = {
        "customer": {},
        "company": {}
    };

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_auth_store_cache");
    }

    setUserForm(form) {
        this.registration.customer = form;
    }

    setCompanyForm(form) {
        this.registration.company = form;
        if (this.registration.company.phone)
            this.registration.company.phone = this.registration.company.phone.replace(/\D/g,''); //todo: make decorators
    }
}

export default new AuthStore();
