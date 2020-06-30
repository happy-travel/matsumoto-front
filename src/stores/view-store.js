import { observable } from "mobx";
import setter from "core/mobx/setter";

class ViewStore {
    @observable
    @setter(null)
    topAlertText = null;

    @observable
    @setter(null)
    openDropdown = null;

    @observable
    @setter
    countries = [];

    @observable
    @setter
    destinations = [];

    isDropdownOpen(id) {
        return this.openDropdown === id;
    }
}

export default new ViewStore();
