import { Component } from "libs/rzf/Component";

import "./Popup.scss";

export class NearPopup extends Component {
    props: {
        horizontal?: boolean,
        [key: string]: any
    }

    getPositionClassname() {
        const element = this.vnode.parent.firstDom as HTMLElement;
        const position = element.getBoundingClientRect();

        if (this.props.horizontal) {
            if ((position.left + position.right) / 2 > window.innerWidth / 2) {
                return `popup--left`
            }
            return `popup--right`
        }
        if ((position.top + position.bottom) / 2 > window.innerHeight / 2) {
            return `popup--above`
        }
        return `popup--under`
    }

    render() {
        let className = `popup ${this.getPositionClassname()}`
        this.props.className && (className += ' ' + this.props.className);

        return [
            <div {...this.props} className={className}>
                {this.props.children}
            </div>
        ]
    }
}