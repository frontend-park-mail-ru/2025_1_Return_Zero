import { Component } from "libs/rzf/Component";
import { NearPopup } from "components/elements/NearPopup";

import './Actions.scss'

export class Actions extends Component {
    props: {
        opened: boolean
        [key: string]: any
    }

    render() {
        return [
            <div style={{ order: 10 }} {...this.props} className={this.props.className || "actions"}>
                <img className="actions__img" src="/static/img/dots.svg"/>
                {this.props.opened && <NearPopup className="actions__popup">
                    {this.props.children}
                </NearPopup>}
            </div>
        ]
    }
}
