import { Component } from "libs/rzf/Component";
import { NearPopup } from "components/elements/NearPopup";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

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
            <div {...this.props} className={this.props.className ? this.props.className + " actions" : "actions"} onClickOutside={this.close} >
                <img onClick={this.switch} className="actions__img" src="/static/img/dots.svg"/>
                {this.state.opened && <NearPopup className="actions__popup" >
                    {this.props.children}
                </NearPopup>}
            </div>
        ]
    }
}

export class ActionsCopyLink extends Component {
    props: {
        link: string,
        [key: string]: any
    }

    copyLink = () => {
        navigator.clipboard.writeText(this.props.link)
        Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
            message: 'Ссылка скопирована',
            type: 'success',
        }))
    }

    render() {
        return [
            <span className="actions-item" onClick={this.copyLink}>Поделиться</span>
        ]
    }
}
