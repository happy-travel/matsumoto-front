import React from "react";
import { observable } from "mobx";
import UI from "./ui-store";

class ViewStore {
    @observable countries = [];
    @observable destinations = [];
    @observable topAlertText = null;

    setCountries(value) {
        const newGroupedCountries = value.reduce(function (r, a) {
            r[a.regionId] = r[a.regionId] || [];
            r[a.regionId].push(a);
            return r;
        }, Object.create(null));
        let countries = [];
        UI.regionList?.forEach(region => {
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

    setDestinationSuggestions(value = []) {
        const typesWeights = {
            'landmark': 1,
            'destination': 2,
            'accommodation': 3,
            'location': 4,
        };
        if (value)
            this.destinations = value.sort((a, b) => typesWeights[b.type?.toLowerCase()] - typesWeights[a.type?.toLowerCase()]);
        else
            this.destinations = [];
    }

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }
}

export default new ViewStore();
