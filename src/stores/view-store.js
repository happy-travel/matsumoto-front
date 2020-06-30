import { observable } from "mobx";
import { decorate } from "simple";
import UI from "./ui-store";

class ViewStore {
    @observable countries = [];
    @observable destinations = [];
    @observable topAlertText = null;

    setCountries(value) {
        this.countries = value;
    }

    setDestinationSuggestions(value = [], currentValue) {
        const typesWeights = {
            'landmark': 1,
            'destination': 2,
            'accommodation': 3,
            'location': 4,
        };
        if (value) {
            this.destinations = value.sort((a, b) => typesWeights[b.type?.toLowerCase()] - typesWeights[a.type?.toLowerCase()]);
            this.destinations = [
                ...this.destinations.filter(item => decorate.cutFirstPart(item.value, currentValue)),
                ...this.destinations.filter(item => !decorate.cutFirstPart(item.value, currentValue))
            ];
            this.destinations.forEach((item, index) => this.destinations[index].value = item.value);
        }
        else
            this.destinations = [];
    }

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }
}

export default new ViewStore();
