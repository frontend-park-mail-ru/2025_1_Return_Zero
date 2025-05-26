import Dispatcher from "libs/flux/Dispatcher";
import { Storage } from "libs/flux/Storage";
import { ACTIONS } from "./actions";

import { NotificationProps } from "components/notifications/Notification";

type NotificationsStorageStor = {
    notifications: NotificationProps[];
}

class NotificationsStorage extends Storage<NotificationsStorageStor> {
    constructor() {
        super();

        this.stor.notifications = [];
        Dispatcher.register(this.handleAction.bind(this));
    }

    protected handleAction(action: any) {
        switch (true) {
            case action instanceof ACTIONS.CREATE_NOTIFICATION:
                const notification = {
                    ...action.payload,
                    id: Date.now().toString()
                }
                this.stor.notifications.push(notification);
                this.callSubs(new ACTIONS.CREATE_NOTIFICATION(notification));
                break;
            case action instanceof ACTIONS.REMOVE_NOTIFICATION:
                this.stor.notifications = this.stor.notifications.filter((n) => n.id !== action.payload);
                this.callSubs(action);
                break;
            default:
                break;
        }
    }

    getNotifications(): Readonly<NotificationProps[]> {
        return this.stor.notifications;
    }
}

export default new NotificationsStorage();
