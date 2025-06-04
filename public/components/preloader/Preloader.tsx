import { Component } from "libs/rzf/Component";

import './Preloader.scss';

export class Preloader extends Component {
    props: {
        width?: number,
        height?: number
    } = {
        width: 10,
        height: 10,
        ...this.props
    }

    render() {
        return [
            <div  className="preloader-container">
                <img style={{"width": `${this.props.width}rem`, "height": `${this.props.height}rem`}} className="preloader" src="/static/img/preloader.svg" alt="preloader" />
            </div>
        ];
    }
}

