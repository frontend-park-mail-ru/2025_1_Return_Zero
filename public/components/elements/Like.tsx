import { Component } from "libs/rzf/Component";

import './Like.scss';

export class Like extends Component {
    props: {
        active: boolean,
        onClick: (e: MouseEvent) => void,
        [key: string]: any
    }

    render() {
        let className = this.props.className ? `like ${this.props.className}` : "like";
        if (this.props.active) className += " active";

        return [
            <div {...this.props} className={className}>
                <img src={this.props.active ? "/static/img/like-active.svg" : "/static/img/like-default.svg"} 
                     alt={this.props.active ? "unlike" : "like"} />
            </div>
        ];
    }
}