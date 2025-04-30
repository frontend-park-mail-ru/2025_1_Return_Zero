import { Component } from "libs/rzf/Component";
import { NearPopup } from "./NearPopup";

import './Actions.scss'

export class Actions extends Component {
    state = {
        opened: false,
    }

    close = () => {
        this.setState({ opened: false })
    };
    switch = () => {
        this.setState({ opened: !this.state.opened })
    };

    render() {
        return [
            <div className="actions" onClickOutside={this.close}>
                <img className="actions__img" src="/static/img/dots.svg" onClick={this.switch} />
                {this.state.opened && <NearPopup className="actions__popup">
                    {this.props.children}
                </NearPopup>}
            </div>
        ]
    }
}