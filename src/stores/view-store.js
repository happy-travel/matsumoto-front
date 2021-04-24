import { observable } from "mobx";
import { MODALS } from "enum/modals-enum";

class ViewStore {
    @observable
    modal = null;

    @observable
    modalData = null;

    setModal(id, data) {
        this.modal = id || null;
        this.modalData = data;
        document.getElementsByTagName("body")?.[0]?.classList.toggle("modal-open", this.modal in MODALS);
    }
}

export default new ViewStore();
