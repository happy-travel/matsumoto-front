import React from "react";
import { observer } from "mobx-react";
import NotificationItem from "./item";
import { $notifications } from "stores";

const MAXIMUM_VISIBLE_NOTIFICATIONS = 3;

@observer
class NotificationList extends React.Component {
    render() {
        if (!$notifications.list.length)
            return null;

        return (
<div className="notifications">
    <div className="wrapper">
        <div className="list">
            { $notifications.list.map(
                (notification, index) => (
                    ($notifications.list.length - index <= MAXIMUM_VISIBLE_NOTIFICATIONS) &&
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
