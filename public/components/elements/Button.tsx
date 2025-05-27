import { Component } from "libs/rzf/Component";

import "./Button.scss";

export class Button extends Component {
    props: {
        active?: boolean,
        [key: string]: any
    }

    render() {
        let className = this.props.className ? `${this.props.className} button` : "button";
        if (this.props.active) className += ' active';
        return [
            <button {...this.props} className={className}>
                {this.props.children}
            </button>
        ];
    }
}

export class ButtonDanger extends Component {
    props: {
        active?: boolean,
        [key: string]: any
    }

    render() {
        let className = this.props.className ? `${this.props.className} button button--danger` : "button button--danger";
        if (this.props.active) className += ' active';
        return [
            <button {...this.props} className={className}>
                {this.props.children}
            </button>
        ];
    }
}

export class ButtonSuccess extends Component {
    props: {
        active?: boolean,
        [key: string]: any
    }

    render() {
        let className = this.props.className ? `${this.props.className} button button--success` : "button button--success";
        if (this.props.active) className += ' active';
        return [
            <button {...this.props} className={className}>
                {this.props.children}
            </button>
        ];
    }
}

export class ButtonAdd extends Component {
    props: {
        active?: boolean,
        [key: string]: any
    }

    render() {
        let className = this.props.className ? `${this.props.className} button button--add` : "button button--add";
        if (this.props.active) className += ' active';
        return [
            <button {...this.props} className={className}>
                <img src="/static/img/plus.svg" alt="error"/>
            </button>
        ]
    }
}
