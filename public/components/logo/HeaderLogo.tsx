import { Link } from "libs/rzf/Router";
import { Component } from "libs/rzf/Component";

import './HeaderLogo.scss';

export class HeaderLogo extends Component {
    render() {
        return [
            <div className="header-logo">
                <Link to='/'><img src="/static/img/logo.svg" alt="Return Zero" /></Link>
            </div>
        ];
    }
}

