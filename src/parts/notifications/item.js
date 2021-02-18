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
            <div className="item">
                {notification.text}
                <div className="close-button" onClick={this.hideAlert}>
                    <span className="icon icon-close" />
                </div>
            </div>
        );
    }
}

export default NotificationItem;
