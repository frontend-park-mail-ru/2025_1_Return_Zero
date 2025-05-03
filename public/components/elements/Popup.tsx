import { Component } from "libs/rzf/Component";

import "./Popup.scss";

export class Popup extends Component {
    render() {
        let className = this.props.className ? `popup ${this.props.className}` : "popup";
        return [
            <div {...this.props} className={className}>
                {this.props.children}
            </div>
        ]
    }
}