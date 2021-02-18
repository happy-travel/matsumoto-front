import { observable } from "mobx";
import setter from "core/mobx/setter";

export const MODALS = {
    CANCELLATION_CONFIRMATION: "CANCELLATION_CONFIRMATION",
    SEND_INVOICE: "SEND_INVOICE",
    SEARCH_OVERLOAD: "SEARCH_OVERLOAD",
    REPORT_DUPLICATE: "REPORT_DUPLICATE",
    READ_ONLY: "READ_ONLY"
};

class ViewStore {
    @observable
    @setter(null)
    topAlertText = null; // todo: remove legacy

    @observable
    @setter(null)
    openDropdown = null;

    @observable
    @setter
    countries = [];

    @observable
    @setter
    destinations = [];

    @observable
    modal = null;

    @observable
    modalData = null;

    setModal(id, data) {
        this.modal = id || null;
        this.modalData = data;
        document.getElementsByTagName("body")?.[0]?.classList.toggle("modal-open", this.modal in MODALS);
    }

    isDropdownOpen(id) {
        return this.openDropdown === id;
    }
}

export default new ViewStore();
