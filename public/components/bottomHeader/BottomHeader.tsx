import { Component } from "libs/rzf/Component";

import router, { Route, Link } from "libs/rzf/Router";

import './BottomHeader.scss';

export class BottomHeader extends Component {
    render() {
        return [
            <div className="bottom-header">
                <Route path="^/search/" exact component={NavItem} elseComponent={NavItem} link="/search/all" icon="icon-search" />
                <Route path="^/" exact component={NavItem} elseComponent={NavItem} link="/" icon="icon-home" />
                <Route path="^/tracks/"  exact component={NavItem} elseComponent={NavItem} link="/tracks" icon="icon-tracks" />
                <Route path="^/albums/" exact component={NavItem} elseComponent={NavItem} link="/albums" icon="icon-albums"  />
                <Route path="^/artists/" exact component={NavItem} elseComponent={NavItem} link="/artists" icon="icon-artists"/>
            </div>
        ];
    }
}

class NavItem extends Component {
    render() {
        return [
            <div className={"bottom_header_icon" + (location.pathname === this.props.link ? " active" : "")}>
                <Link to={this.props.link}>
                    <img draggable={false} src={(location.pathname === this.props.link 
                                                    ? "/static/img/" + this.props.icon + ".svg" 
                                                    : "/static/img/" + this.props.icon + "-light.svg" )} />
                </Link>
            </div>
        ];
    }
}
