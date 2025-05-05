import { Component } from "libs/rzf/Component";
import { NearPopup } from "components/elements/NearPopup";

import './Actions.scss'

export class Actions extends Component {
    props: {
        [key: string]: any
    }

    state = {
        opened: false
    }

    open = () => {
        this.setState({opened: true})
    }

    close = (e: Event) => {
        this.setState({opened: false})
    }

    switch = () => {
        this.setState({opened: !this.state.opened})
    }

    render() {
        return [
            <div style={{ order: 10 }} {...this.props} className={this.props.className || "actions"} onClickOutside={this.close} >
                <img onClick={this.switch} className="actions__img" src="/static/img/dots.svg"/>
                {this.state.opened && <NearPopup className="actions__popup" >
                    {this.props.children}
                </NearPopup>}
            </div>
        ]
    }
}
