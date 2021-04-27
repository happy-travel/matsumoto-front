import { makeAutoObservable } from "mobx";
import autosave from "core/misc/autosave";
import { APR_VALUES } from "enum";
import { decorate } from "simple";

class PersonalStore {
    information = {
        email: null,
        lastName: null,
        firstName: null,
        title: null,
        position: null
    };
    settings = {
        weekStarts: 0,
        availableCredit: true
    };
    counterpartyInfo = null;
    balance = null;
    agencyAPR = APR_VALUES.NotDisplay;
    bookingList = null;
    registration = {
        agent: {},
        counterparty: {}
    };

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

    setRegistrationAgentForm(form) {
        this.registration.agent = form;
    }

    setRegistrationCounterpartyForm(form) {
        form.phone = decorate.removeNonDigits(form.phone);
        if (form.fax)
            form.fax = decorate.removeNonDigits(form.fax);

        this.registration.counterparty = {
            counterpartyInfo: {
                id: 1,
                name: form.name,
                legalAddress: form.legalAddress,
                preferredPaymentMethod: form.preferredPaymentMethod
            },
            rootAgencyInfo: {
                address: form.address,
                countryCode: form.countryCode,
                countryName: form.country,
                city: form.city,
                phone: form.phone,
                fax: form.fax,
                postalCode: form.postalCode,
                website: form.website
            }
        };
    }

    setInformation(values) { this.information = values; }
    setCounterpartyInfo(values) { this.counterpartyInfo = values; }
    setBalance(values) { this.balance = values; }
    setAgencyAPR(values) { this.agencyAPR = values; }
    setBookingList(values) { this.bookingList = values; }
}

export default new PersonalStore();
