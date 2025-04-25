import { Component } from "libs/rzf/Component";

import "./Button.scss";

export class Button extends Component {
    constructor(props: Record<string, any>) {
        super(props);
        this.props.className = this.props.className ? `${this.props.className} button` : "button";
    }

    render() {
        const className = this.props.className ? `${this.props.className} button` : "button;";
        return [
            <button {...this.props} className={className}>
                {this.props.children}
            </button>
        ];
    }
}