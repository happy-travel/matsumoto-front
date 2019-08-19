import React from "react";
import { observable, computed } from "mobx";
import autosave from "core/misc/autosave";
import { decorate } from "core";

class UIStore {
    @observable regions = [];
    @observable countries = [];
    @observable destinations = [];
    @observable currencies = [];
    @observable initialized = false;
    @observable openDropdown = null;
    @observable suggestions = {};

    constructor() {
        autosave(this, "_ui_store_cache");
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
        this.regions = value;
    }
    setInitialized(value) {
        this.initialized = value;
    }

    setCurrencies(value) {
        this.currencies = value;
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
        this.destinations = value;
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
    }

}

export default new UIStore();
