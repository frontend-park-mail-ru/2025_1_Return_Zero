import { Component } from "libs/rzf/Component";
import { Notification, NotificationProps } from "./Notification";

import { NOTIFICATIONS_STORAGE } from "utils/flux/storages";
import { ACTIONS } from "utils/flux/actions";

import './Notifications.scss'

export class Notifications extends Component {
    state: {
        notifications: NotificationProps[]
        [key: string]: any
    } = {
        notifications: []
    }

    componentDidMount() { NOTIFICATIONS_STORAGE.subscribe(this.onAction); }
    componentWillUnmount() { NOTIFICATIONS_STORAGE.unsubscribe(this.onAction); }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.CREATE_NOTIFICATION:
            case action instanceof ACTIONS.REMOVE_NOTIFICATION:
                this.setState({ notifications: NOTIFICATIONS_STORAGE.getNotifications() })
        }
    }

    render() {
        return [
            <div className="notifications-container">
                {this.state.notifications.map(n => <Notification key={n.id} {...n} />)}
            </div>
        ]
    }
}


