import React from "react";
import { autorun, observable, computed } from "mobx";


//todo: разбить на UIStore и common-store
class CommonStore {
    @observable regions = [];
    @observable cities = [];
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

    setCities(value) {
        this.cities = value;
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
    }

    setCurrentSuggestion(value) {
        this.currentSuggestion = value || '';
    }
}

export const commonStore = new CommonStore();

export default commonStore;