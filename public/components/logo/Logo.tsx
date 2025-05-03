import { Link } from "libs/rzf/Router";
import { Component } from "libs/rzf/Component";

import './Logo.scss';

export class Logo extends Component {
    render() {
        return [
            <div className="logo">
                <Link to='/'><img src="/static/img/logo.svg" alt="Return Zero" /></Link>
            </div>
        ];
    }
}

