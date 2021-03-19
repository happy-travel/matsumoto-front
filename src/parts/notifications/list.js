import React from "react";
import { observer } from "mobx-react";
import NotificationItem from "./item";
import Notifications from "stores/notifications-store";

const MAXIMUM_VISIBLE_NOTIFICATIONS = 3;

@observer
class NotificationList extends React.Component {
    render() {
        if (!Notifications.list.length)
            return null;

        return (
<div className="notifications">
    <div className="wrapper">
        <div className="list">
            { Notifications.list.map(
                (notification, index) => (
                    (Notifications.list.length - index <= MAXIMUM_VISIBLE_NOTIFICATIONS) &&
                        <NotificationItem
                            notification={notification}
                            key={notification.id}
                        />
                )
            )}
        </div>
    </div>
</div>
        );
    }
}

export default NotificationList;
