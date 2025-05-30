import { Component } from "libs/rzf/Component";

import "./Popup.scss";

export class NearPopup extends Component {
    props: {
        [key: string]: any
    }

    getPositionClassname() {
        const element = this.vnode.parent.firstDom as HTMLElement;
        const position = element.getBoundingClientRect();

        return ((position.top + position.bottom) > window.innerHeight ? 'popup--above' : 'popup--under') + ' ' +
                ((position.left + position.right) > window.innerWidth ? 'popup--left': 'popup--right');
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