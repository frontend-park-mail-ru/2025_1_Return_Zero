import { Component } from "libs/rzf/Component"
import './forms.scss'

export class Selective<T> extends Component {
    props: {
        props: T,
        component: typeof Component,
        selected: boolean,
        onSelect: (props: T, selected: boolean) => void,
    }

    clicked = (e: MouseEvent) => {
        this.props.onSelect(this.props.props, !this.props.selected)
    }

    render() {
        const Comp = this.props.component;
        return [
            <div className={"selective" + (this.props.selected ? " active" : "")} onClick={this.clicked}>
                <Comp {...this.props.props} />
            </div>
        ]
    }
}
