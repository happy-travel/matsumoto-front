import React from "react";
import { $notifications } from "stores";

const NotificationItem = ({ notification }) => {
    const hideAlert = () => {
        $notifications.closeNotification(notification.id);
    };

    const { text, title, style, temporary } = notification;

    return (
        <div className={"item" + __class(style)}>
            <div className="content">
                { style &&
                    <div className="style">
                        <i />
                    </div>
                }
                <div className="holder">
                    <div className="text">
                        { title &&
                            <h2>{title}</h2>
                        }
                        <div>{text}</div>
                    </div>
                </div>
            </div>
            { temporary &&
                <div className="progress-timer">
                    <div className="bar" />
                </div>
            }
            <div className="close-button" onClick={hideAlert}>
                <span className="icon icon-close" />
            </div>
        </div>
    );
};

export default NotificationItem;
