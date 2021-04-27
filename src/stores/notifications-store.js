import { makeAutoObservable } from "mobx";

class NotificationsStore {
    list = [];

    constructor() {
        makeAutoObservable(this);
    }

    addPermanentNotification(text, title, style = "warning", temporary) {
        const id = Math.trunc(Math.random() * 10000000);
        if (text?.length > 1) {
            this.list.push({
                id,
                text,
                title,
                style,
                temporary
            });
            return id;
        }
    }

    addNotification(text, title, style) {
        const id = this.addPermanentNotification(text, title, style, true);
        setTimeout(() => {
            this.closeNotification(id);
        }, 15000);
    }

    closeAllNotifications() {
        this.list = [];
    }

    closeNotification(id) {
        let index;
        this.list.forEach((item, i) => {
            if (item.id == id)
                index = i;
        });
        if (index !== undefined)
            this.list.splice(index, 1);
    }
}

export default new NotificationsStore();
