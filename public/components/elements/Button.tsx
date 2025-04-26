import { Component } from "libs/rzf/Component";

import "./Button.scss";

export class Button extends Component {
    render() {
        const className = this.props.className ? `${this.props.className} button` : "button";
        return [
            <button {...this.props} className={className}>
                {this.props.children}
            </button>
        ];
    }
}

export class ButtonDanger extends Component {
    render() {
        const className = this.props.className ? `${this.props.className} button button--danger` : "button button--danger";
        return [
            <button {...this.props} className="button button--danger">
                {this.props.children}
            </button>
        ];
    }
}

export class ButtonSuccess extends Component {
    render() {
        const className = this.props.className ? `${this.props.className} button button--success` : "button button--success";
        return [
            <button {...this.props} className="button button--success">
                {this.props.children}
            </button>
        ];
    }
}