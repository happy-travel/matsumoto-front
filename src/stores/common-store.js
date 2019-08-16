import React from "react";
import { autorun, observable, computed } from "mobx";

//todo: split to UIStore и common-store
class CommonStore {
    @observable regions = [];
    @observable countries = [];
    @observable destinations = [];
    @observable currencies = [];
    @observable initialized = false;
    @observable openDropdown = null;
    @observable currentSuggestion = '';

    constructor() {
    }

    @computed get regionList() {
        if (this.initialized)
            return this.regions;

        //return from cache
        return {cache: true};
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

    setCurrentSuggestion(value) {
        this.currentSuggestion = value || '';
    }
}

const commonStore = new CommonStore();

export default commonStore;