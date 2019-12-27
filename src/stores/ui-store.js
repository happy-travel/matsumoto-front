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
    @observable countries = [];
    @observable destinations = [];
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
    @observable topAlertText = null;
    @observable advancedSearch = false;

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_ui_store_cache");
    }

    @computed get regionList() {
        if (this.initialized)
            return this.regions;

        return null;
    }

    getSuggestion(field, value) {
        if (this.suggestions[field] && this.suggestions[field].suggestion && value == this.suggestions[field].value)
            return decorate.cutFirstPart(this.suggestions[field].suggestion, value);

        return null;
    }

    setSuggestion(field, value, suggestion) {
        if (value && suggestion) {
            this.suggestions[field] = { value, suggestion };
            return;
        }

        if (this.suggestions[field])
            this.suggestions[field] = null;
    }

    setRegions(value) {
        this.regions = value || [];
    }
    setInitialized(value) {
        this.initialized = value || false;
    }

    setCurrencies(value) {
        this.currencies = value || [];
    }

    setCountries(value) {
        const newGroupedCountries = value.reduce(function (r, a) {
            r[a.regionId] = r[a.regionId] || [];
            r[a.regionId].push(a);
            return r;
        }, Object.create(null));
        let countries = [];
        this.regionList?.forEach(region => {
            if (newGroupedCountries[region.id]) {
                countries = countries.concat(newGroupedCountries[region.id].sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                }));
            }
        });
        this.countries = countries;
    }

    setDestinationSuggestions(value) {
        this.destinations = value || [];
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

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }

    toggleAdvancedSearch(value) {
        if (typeof value != "undefined")
            this.advancedSearch = value;
        else
            this.advancedSearch = !this.advancedSearch;
    }
}

export default new UIStore();
