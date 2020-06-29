import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { decorate } from "simple";

const defaultUserSettings = {
    loaded: false,
    weekStarts: 0,
    availableCredit: true
};

class AuthStore {
    @observable user = {
        "email": null,
        "lastName": null,
        "firstName": null,
        "title": null,
        "position": null
    };

    @observable settings = defaultUserSettings;

    @observable registration = {
        "agent": {},
        "counterparty": {}
    };

    constructor() {
        autosave(this, "_auth_store_cache");
    }

    @computed get activeCounterparty() {
        return this.user?.counterparties && this.user?.counterparties[0] || {};
    }

    setUser(value) {
        this.user = value;
    }

    setSettings(value = {}) {
        this.settings = {
            ...value,
            ...this.settings,
            loaded: true
        };
    }

    setRegistrationUserForm(form) {
        this.registration.agent = form;
    }

    setRegistrationCounterpartyForm(form) {
        form.phone = decorate.removeNonDigits(form.phone);
        if (form.fax)
            form.fax = decorate.removeNonDigits(form.fax);

        this.registration.counterparty = form;
    }
}

export default new AuthStore();
