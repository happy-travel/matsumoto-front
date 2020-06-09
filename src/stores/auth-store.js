import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { RenderTheApp } from "../";
import { StorageUserIdKey } from "core/storage";

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

    @observable userCache = null;
    @observable cachedUserRegistered = false;

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

    setUserCache(newUserCache) {
        var rerenderNeeded = this.userCache?.access_token != newUserCache?.access_token;

        if (newUserCache?.profile?.email)
            window.localStorage.setItem(StorageUserIdKey, btoa(newUserCache.profile?.email));
        else
            window.localStorage.removeItem(StorageUserIdKey);

        if (newUserCache?.access_token)
            this.userCache = {
                access_token: newUserCache?.access_token
            };
        else {
            this.userCache = null;
            this.cachedUserRegistered = false;
        }
        if (rerenderNeeded)
            RenderTheApp();
    }

    setCachedUserRegistered(value) {
        this.cachedUserRegistered = value;
    }

    setSettings(value) {
        this.settings = value || {};
        this.settings.loaded = true;
    }
}

export default new AuthStore();
