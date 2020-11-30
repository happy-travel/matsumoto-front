import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import setter from "core/mobx/setter";
import { decorate } from "simple";

export const APR_VALUES = {
    NotDisplay: 1,
    DisplayOnly: 2,
    CardPurchasesOnly: 3,
    CardAndAccountPurchases: 4
};

const defaultUserSettings = {
    weekStarts: 0,
    availableCredit: true
};

class AuthStore {
    @observable
    @setter
    user = {
        email: null,
        lastName: null,
        firstName: null,
        title: null,
        position: null
    };

    @observable
    settings = defaultUserSettings;

    @observable
    @setter
    counterpartyInfo = null;

    @observable
    @setter
    balance = null;

    @observable
    @setter
    agencyAPR = APR_VALUES.NotDisplay;

    @observable
    registration = {
        agent: {},
        counterparty: {}
    };

    constructor() {
        autosave(this, "_auth_store_cache");
    }

    @computed get activeCounterparty() {
        return this.user?.counterparties?.[0] || {};
    }

    permitted(permission) {
        return this.activeCounterparty?.inAgencyPermissions?.includes(permission) || false;
    }

    setSettings(value = {}) {
        this.settings = {
            ...this.settings,
            ...value
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
