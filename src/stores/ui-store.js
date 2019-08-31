import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { decorate } from "core";

/* Refactoring possibility: import babel-plugin-objective-enums and make enums */
export const MODALS = {
    ACCOMMODATION_DETAILS: "ACCOMMODATION_DETAILS"
};

class UIStore {
    @observable regions = [];
    @observable countries = [];
    @observable destinations = [];
    @observable currencies = [];
    @observable initialized = false;
    @observable openDropdown = null;
    @observable suggestions = {
        "destination": null,
        "nationality": null,
        "residency": null
    };
    @observable modal = null;
    @observable hotelDetails = null;
    @observable user = {
        "email": null,
        "lastName": null,
        "firstName": null,
        "title": null,
        "position": null
    };
    @observable topAlertText = null;

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
        //todo: repair this sort, it's temporary -- needs correct locale getting
        value.sort((a,b) => {
            if ( a.names.en < b.names.en ) return -1;
            if ( a.names.en > b.names.en ) return 1;
            return 0;
        });
        this.countries = value;
    }

    setDestinationSuggestions(value) {
        this.destinations = value || [];
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
    }

    setHotelDetails(value) {
        this.hotelDetails = value || null;
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
}

export default new UIStore();
