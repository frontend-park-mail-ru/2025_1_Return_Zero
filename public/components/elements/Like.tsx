import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { USER_STORAGE } from "utils/flux/storages"
import { ACTIONS } from "utils/flux/actions"

import './Like.scss';

export class Like extends Component {
    props: {
        active: boolean,
        onClick: (e: MouseEvent) => void,
        [key: string]: any
    }

    componentDidMount(): void { USER_STORAGE.subscribe(this.onAction); }
    componentWillUnmount(): void { USER_STORAGE.unsubscribe(this.onAction); }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_LOGOUT:
            case action instanceof ACTIONS.USER_CHANGE:
                this.setState({});
                break;
        }
    }

    render() {
        let className = this.props.className ? `like ${this.props.className}` : "like";
        if (this.props.active) className += " active";

        if (!USER_STORAGE.getUser()) {
            return [
                <Link to="#login" {...this.props} className={className}>
                    <img src="/static/img/like-default.svg" alt={this.props.active ? "unlike" : "like"} />
                </Link>
            ]
        }
        return [
            <div {...this.props} className={className}>
                <img src={this.props.active ? "/static/img/like-active.svg" : "/static/img/like-default.svg"} 
                     alt={this.props.active ? "unlike" : "like"} />
            </div>
        ];
    }
}