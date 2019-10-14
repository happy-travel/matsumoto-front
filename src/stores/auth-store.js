import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";

class AuthStore {
    @observable registration = {
        "customer": {},
        "company": {}
    };
    @observable invitationCode = null;
    @observable invitationData = null;

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

    setInvitationCode(value) {
        this.invitationCode = value || null;
    }
    setInvitationData(value) {
        this.invitationData = value || null;
    }
}

export default new AuthStore();
