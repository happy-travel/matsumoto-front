import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { decorate } from "core";

/* Refactoring possibility: import babel-plugin-objective-enums and make enums */
export const MODALS = {
    ACCOMMODATION_DETAILS: "ACCOMMODATION_DETAILS",
    CANCELLATION_CONFIRMATION: "CANCELLATION_CONFIRMATION",
    SEND_INVOICE: "SEND_INVOICE"
};

export const INVOICE_TYPES = {
    VOUCHER: "VOUCHER",
    INVOICE: "INVOICE"
};

class UIStore {
    @observable regions = [];
    @observable currencies = [];
    @observable initialized = false;
    @observable openDropdown = null;
    @observable focusedDropdownIndex = null;
    @observable suggestions = {
        "destination": null,
        "nationality": null,
        "residency": null
    };
    @observable modal = null;
    @observable modalData = null;
    @observable user = {
        "email": null,
        "lastName": null,
        "firstName": null,
        "title": null,
        "position": null
    };
    @observable advancedSearch = false;

    @observable formCache = {};

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
        this.regions = value && Array.isArray(value) ? value.sort((currentRegion, nextRegion) => {
            if (currentRegion.id === 142 || currentRegion.name === "Asia") {
                return -1;
            }
            if (nextRegion.id === 142 || nextRegion.name === "Asia") {
                return 1;
            }
            return 0;
        }) : [];
    }
    setInitialized(value) {
        this.initialized = value || false;
    }

    setCurrencies(value) {
        this.currencies = value || [];
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
        this.focusedDropdownIndex = null;
    }

    setFocusedDropdownIndex(index) {
        this.focusedDropdownIndex = index;
    }

    setModalData(value) {
        this.modalData = value || null;
    }

    setModal(id) {
        this.modal = id || null;
        document.getElementsByTagName("body")?.[0]?.classList.toggle("modal-open", this.modal in MODALS);
    }

    setUser(value) {
        this.user = value;
    }

    toggleAdvancedSearch(value) {
        if (typeof value != "undefined")
            this.advancedSearch = value;
        else
            this.advancedSearch = !this.advancedSearch;
    }

    getFormCache(formName) {
        return this.formCache[formName] ? JSON.parse(this.formCache[formName]) : null;
    }

    setFormCache(formName, values) {
        this.formCache[formName] = JSON.stringify(values);
    }
}

export default new UIStore();
