import { makeAutoObservable } from "mobx";
import autosave from "core/misc/autosave";
import { APR_VALUES } from "enum";

class PersonalStore {
    information = {};
    settings = {
        weekStarts: 0,
        availableCredit: true
    };
    counterpartyInfo = null;
    balance = null;
    agencyAPR = APR_VALUES.NotDisplay;
    bookingList = null;

    constructor() {
        makeAutoObservable(this);
        autosave(this, "_personal_store_cache");
    }

    get activeCounterparty() {
        return this.information?.counterparties?.[0] || {};
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

    setInformation(values) { this.information = values; }
    setCounterpartyInfo(values) { this.counterpartyInfo = values; }
    setBalance(values) { this.balance = values; }
    setAgencyAPR(values) { this.agencyAPR = values; }
    setBookingList(values) { this.bookingList = values; }
}

export default new PersonalStore();
