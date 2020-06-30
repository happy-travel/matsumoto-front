import { observable } from "mobx";

class ViewStore {
    @observable topAlertText = null;
    @observable openDropdown = null;
    @observable lineFocusedInDropdownIndex = null;

    @observable countries = [];
    @observable destinations = [];

    setTopAlertText(value) {
        this.topAlertText = value || null;
    }

    setOpenDropdown(id) {
        this.openDropdown = id || null;
        this.lineFocusedInDropdownIndex = null;
    }

    setLineFocusedInDropdownIndex(index) {
        this.lineFocusedInDropdownIndex = index;
    }

    setCountries(value) {
        this.countries = value;
    }

    setDestinationSuggestions(value) {
        this.destinations = value;
    }
}

export default new ViewStore();
