import { Component } from "libs/rzf/Component";

import './Preloader.scss';

export class Preloader extends Component {
    render() {
        return [
            <div width={this.props.width} height={this.props.height} className="preloader-container">
                <img className="preloader" src="/static/img/preloader.svg" alt="preloader" />
            </div>
        ];
    }
}

