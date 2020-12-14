import React from "react";
import { observer } from "mobx-react";
import Notifications from "stores/notifications-store";

@observer
class NotificationItem extends React.Component {
    hideAlert = () => {
        var { index } = this.props;
        Notifications.closeNotification(index);
    }

    render() {
        var { notification } = this.props;

        return (
            <div class="item">
                {notification.text}
                <div class="close-button" onClick={this.hideAlert}>
                    <span class="icon icon-close" />
                </div>
            </div>
        );
    }
}

export default NotificationItem;
