import { observable } from "mobx";

class ViewStore {
    @observable topAlertText = null;
    @observable openDropdown = null;

    @observable countries = [];
    @observable destinations = [];

    isDropdownOpen(id) {
        return this.openDropdown === id;
    }

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
    }

    setCountries(value) {
        this.countries = value;
    }

    setDestinationSuggestions(value) {
        this.destinations = value;
    }
}

export default new ViewStore();
