import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import setter from "core/mobx/setter";
import { APR_VALUES } from "enum";
import { decorate } from "simple";

class PersonalStore {
    @observable
    @setter
    information = {
        email: null,
        lastName: null,
        firstName: null,
        title: null,
        position: null
    };

    @observable
    settings = {
        weekStarts: 0,
        availableCredit: true
    };

    @observable
    @setter
    counterpartyInfo = null;

    @observable
    @setter
    companyInfo = null;

    @observable
    @setter
    balance = null;

    @observable
    @setter
    agencyAPR = APR_VALUES.NotDisplay;

    @observable
    @setter
    bookingList = null;

    @observable
    registration = {
        agent: {},
        counterparty: {}
    };

    constructor() {
        autosave(this, "_personal_store_cache");
    }

    @computed get activeCounterparty() {
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

    $setRegistrationAgentForm(form) {
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
}

export default new PersonalStore();
