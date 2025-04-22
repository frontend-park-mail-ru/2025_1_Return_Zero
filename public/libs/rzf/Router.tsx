import h from './jsx'
import * as VDom from './VDom'
import { Component } from './Component'
import { config } from './rzf_config'

export type RouteProps = VDom.NodePropsArg & {
    path: string,   
}


const routes: Route[] = [];

function onUrlChange() {
    config.verboseRouter && console.log(`onUrlChange ${window.location.href}`, routes);
    for (const route of routes) {
        route.setState({});  // force rerender
    }
}

window.addEventListener('popstate', (e) => {
    e.preventDefault();
    onUrlChange()
})


export class Route extends Component {
    constructor(props: RouteProps, children: VDom.Node[]) {
        super(props);
        this.children = children;
    }

    componentDidMount() {
        routes.push(this);
        config.verboseRouter && console.log(routes);
    }

    componentWillUnmount(): void {
        routes.splice(routes.indexOf(this), 1);
    }

    render(): VDom.Node {
        if ((window.location.pathname + window.location.hash).match(this.props.path)) {
            return this.children[0];
        }
        
        return <div style={{ display: 'none' }}>{this.props.path}</div>;
    }
}

export type LinkProps = VDom.NodePropsArg & {
    to: string,
    data?: any
}

export class Link extends Component {
    constructor(props: LinkProps, children: VDom.Node[]) {
        super(props, children);
        this.children = children;
    }

    handleClick(event: Event) {
        event = event as MouseEvent;

        event.preventDefault();
        window.history.pushState(this.props.data, '', this.props.to);
        onUrlChange();
    }

    render(): VDom.Node {
        return (
            <a href={this.props.to} handle={{ 'click': this.handleClick.bind(this) }}>{...this.children}</a>
        );
    }
}