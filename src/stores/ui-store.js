import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { decorate } from "simple";

/* Refactoring possibility: import babel-plugin-objective-enums and make enums */
export const MODALS = {
    ACCOMMODATION_DETAILS: "ACCOMMODATION_DETAILS",
    CANCELLATION_CONFIRMATION: "CANCELLATION_CONFIRMATION",
    SEND_INVOICE: "SEND_INVOICE",
    SEARCH_OVERLOAD: "SEARCH_OVERLOAD"
};

export const INVOICE_TYPES = {
    VOUCHER: "VOUCHER",
    INVOICE: "INVOICE"
};

const ourCompanyInfoDefault = {"name":"HappyTravelDotCom Travel and Tourism LLC","address":"B105, Saraya Avenue building, Garhoud, Deira","country":"United Arab Emirates","city":"Dubai","phone":"+971-4-2940007","email":"info@happytravel.com","postalCode":"Box 36690","trn":"100497287100003","iata":"96-0 4653","tradeLicense":"828719"};

class UIStore {
    @observable regions = [];
    @observable currencies = [];
    @observable initialized = false;
    @observable suggestions = {
        "destination": null,
        "nationality": null,
        "residency": null
    };
    @observable modal = null;
    @observable modalData = null;
    @observable advancedSearch = false;
    @observable ourCompanyInfo = ourCompanyInfoDefault;

    @observable formCache = {};

    @observable currentAPIVersion = null;

    @observable saveCreditCard = false;

    constructor() {
        autosave(this, "_ui_store_cache");
    }

    @computed get regionList() {
        if (this.initialized)
            return this.regions;

        return null;
    }

    @computed get isAppInitialized() {
        return (this.initialized && this.regions.length && this.currencies.length);
    }

    getSuggestion(field, value) {
        if (this.suggestions[field] && this.suggestions[field].suggestion && value == this.suggestions[field].value)
            return decorate.cutFirstPart(this.suggestions[field].suggestion, value);

        return null;
    }

    setSuggestion(field, value, suggestion) {
        if (value && suggestion) {
            this.suggestions[field] = { value, suggestion: suggestion.value, suggestionExtendInfo: suggestion };
            return;
        }

        if (this.suggestions[field])
            this.suggestions[field] = null;
    }

    setRegions(value) {
        if (!value || !Array.isArray(value))
            return [];

        this.regions = value.sort((currentRegion, nextRegion) => {
            if (currentRegion.id === 142 || currentRegion.name === "Asia") {
                return -1;
            }
            if (nextRegion.id === 142 || nextRegion.name === "Asia") {
                return 1;
            }
            return 0;
        });
    }

    setInitialized(value) {
        this.initialized = value || false;
    }

    setCurrencies(value) {
        this.currencies = value || [];
    }

    setModalData(value) {
        this.modalData = value || null;
    }

    setModal(id) {
        this.modal = id || null;
        document.getElementsByTagName("body")?.[0]?.classList.toggle("modal-open", this.modal in MODALS);
    }

    toggleAdvancedSearch(value) {
        if (typeof value != "undefined")
            this.advancedSearch = value;
        else
            this.advancedSearch = !this.advancedSearch;
    }

    getFormCache(formName) {
        if (!formName) return null;
        if (!this.formCache[formName])
            return null;
        var result = null;
        try {
            result = JSON.parse(this.formCache[formName]);
        } catch (e) {}
        return result;
    }

    setFormCache(formName, values) {
        if (!formName) return null;
        this.formCache[formName] = values ? JSON.stringify(values) : null;
    }

    dropFormCache(formName) {
        this.setFormCache(formName);
    }

    dropAllFormCaches() {
        this.formCache = {};
    }

    setCurrentAPIVersion(value) {
        this.currentAPIVersion = value;
    }

    setSaveCreditCardFlag(value) {
        this.saveCreditCard = value || false;
    }

    setOurCompanyInfo(value) {
        this.ourCompanyInfo = value;
    }
}

export default new UIStore();
