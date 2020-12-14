import React from "react";
import { observer } from "mobx-react";
import NotificationItem from "./item";
import Notifications from "stores/notifications-store";

@observer
class NotificationList extends React.Component {
    render() {
        if (!Notifications.list.length)
            return null;

        return (
            <div class="notifications">
                {Notifications.list.map(
                    (notification, index) =>
                        <NotificationItem
                            notification={notification}
                            index={index}
                        />
                )}
            </div>
        );
    }
}

export default NotificationList;
