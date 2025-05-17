import { Component } from "libs/rzf/Component";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

import './Notifications.scss'

const NOTIFICATION_TIME = 2000;

export type NotificationProps = {
    id?: string;
    type: 'success' | 'error';
    message: string,
    [key: string]: any;
}

export class Notification extends Component {
    timeout: number;
    props: NotificationProps;

    componentDidMount(): void { 
        this.timeout = window.setTimeout(this.close, NOTIFICATION_TIME)
    }

    componentWillUnmount(): void {
        clearTimeout(this.timeout)
    }

    close = () => {
        Dispatcher.dispatch(new ACTIONS.REMOVE_NOTIFICATION(this.props.id))
    }

    render() {
        const className = `notification notification--${this.props.type}`
        return [
            <div className={className}>
                <span className="notification__content">{this.props.message}</span>
                <span className="notification__close" onClick={this.close}></span>
            </div>
        ]
    }
}