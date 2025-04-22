import h from "libs/rzf/jsx";
import { Component } from "libs/rzf/Component";

import "./Button.scss";

export class Button extends Component {
    render() {
        this.props.classes.push("button");
        return (
            <button {...this.props}>
                {...this.children}
            </button>
        );
    }
}