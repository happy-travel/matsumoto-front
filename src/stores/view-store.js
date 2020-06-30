import { observable } from "mobx";

class ViewStore {
    @observable topAlertText = null;

    @observable countries = [];
    @observable destinations = [];

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }

    setCountries(value) {
        this.countries = value;
    }

    setDestinationSuggestions(value) {
        this.destinations = value;
    }
}

export default new ViewStore();
