import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";

const defaultUserSettings = {
    loaded: false,
    weekStarts: 0,
    availableCredit: true
};

class AuthStore {
    @observable registration = {
        "agent": {},
        "counterparty": {}
    };

    @observable user = {
        "email": null,
        "lastName": null,
        "firstName": null,
        "title": null,
        "position": null
    };

    @observable isUserDataLoading = true;

    @observable settings = defaultUserSettings;

    constructor() {
        autosave(this, "_auth_store_cache");
    }

    @computed get activeCounterparty() {
        return this.user?.counterparties && this.user?.counterparties[0] || {};
    }

    setUser(value) {
        this.user = value;
        this.isUserDataLoading = false;
    }

    setUserForm(form) {
        this.registration.agent = form;
    }

    setCounterpartyForm(form) {
        this.registration.counterparty = form;
        if (this.registration.counterparty.phone) {
            this.registration.counterparty.phone = this.registration.counterparty.phone.replace(/\D/g,''); //todo: make decorators
        }
        if (this.registration.counterparty.fax) {
            this.registration.counterparty.fax = this.registration.counterparty.fax.replace(/\D/g,'');
        }
    }

    setCountryValue(country) {
        this.registration.counterparty.countryCode = country.code;
    }

    setSettings(value) {
        this.settings = value || {};
        this.settings.loaded = true;
    }
}

export default new AuthStore();
