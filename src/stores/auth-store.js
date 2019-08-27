import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";

class AuthStore {
    @observable registration = {
        "masterCustomer": {
            "title": "Mr",
            "firstName": "Name",
            "lastName": "Surname",
            "position": "Position",
            "email": "email@email.com"
        },
        "company": {
            "name": "Company",
            "address": "UAE",
            "countryCode": "UA",
            "city": "Moscow",
            "phone": "7777778",
            "fax": "7777778",
            "preferredCurrency": "USD",
            "preferredPaymentMethod": "CreditCard",
            "website": "http://happytrvael.com"
        }
    };

    constructor() {
    //    autosave(this, "_auth_store_cache");
    }

    setUserForm(form) {
        this.registration.masterCustomer = {
            ...this.registration.masterCustomer,
            "firstName": form.firstName,
            "lastName": form.lastName,
            "position": form.position,
            "email": form.email
        };
    }

    setCompanyForm(form) {
        this.registration.company = {
            ...this.registration.company,
            "name": form.name
        };
    }

    /* todo: normal store no workaround
    @observable registration = {
        masterCustomer: {},
        company: {}
    };

    setUserForm(form) {
        this.registration.masterCustomer = form;
    }

    setCompanyForm(form) {
        this.registration.company = form;
    }
    */
}

export default new AuthStore();
