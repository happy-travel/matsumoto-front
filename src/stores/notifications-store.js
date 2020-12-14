import { observable } from "mobx";

const MAXIMUM_LENGTH = 3;

class NotificationsStore {
    @observable
    list = [];

    addNotification(text) {
        if (text?.length > 1)
            this.list.push({
                text
            });
        if (this.list.length > MAXIMUM_LENGTH)
            this.closeNotification(0);
    }

    closeAllNotifications() {
        this.list = [];
    }

    closeNotification(index) {
        this.list.splice(index, 1);
    }
}

export default new NotificationsStore();
