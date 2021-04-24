import { observable } from "mobx";
import { MODALS } from "enum/modals-enum";

class ViewStore {
    @observable
    openDropdown = null;

    @observable
    modal = null;

    @observable
    modalData = null;

    setModal(id, data) {
        this.modal = id || null;
        this.modalData = data;
        document.getElementsByTagName("body")?.[0]?.classList.toggle("modal-open", this.modal in MODALS);
    }

    setOpenDropdown(value, softly) {
        if (softly) {
            if (!value && (["residencyPicker", "residency", "nationality"].includes(this.openDropdown)))
                return;
        }
        this.openDropdown = value;
    }

    isDropdownOpen(id) {
        if (id == "residencyPicker" && (this.openDropdown == "residency" || this.openDropdown == "nationality"))
            return true;
        return this.openDropdown === id;
    }
}

export default new ViewStore();
