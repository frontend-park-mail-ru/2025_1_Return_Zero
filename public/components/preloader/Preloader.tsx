import { Component } from "libs/rzf/Component";

import './Preloader.scss';

export class Preloader extends Component {
    props: {
        width?: number,
        height?: number
    } = {
        width: 15,
        height: 15,
        ...this.props
    }

    render() {
        return [
            <div className="preloader-container">
                <img width={this.props.width} height={this.props.height} className="preloader" src="/static/img/preloader.svg" alt="preloader" />
            </div>
        ];
    }
}

