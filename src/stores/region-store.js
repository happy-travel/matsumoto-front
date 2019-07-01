import React from "react";
import { autorun, observable, computed } from "mobx";

class RegionStore {
    @observable regions = [];
    @observable cities = [];
    @observable initialized = false;

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
}

export const regionStore = new RegionStore();

export default regionStore;