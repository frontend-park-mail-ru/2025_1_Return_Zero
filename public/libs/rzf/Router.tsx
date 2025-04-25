import { Component } from "./Component";

class Router {
    routes: Route[] = [];

    handleRoute(e: PopStateEvent) {
        e.preventDefault();
        this.callRoutes();
    }
    
    addRoute(route: Route) {
        this.routes.push(route);
    }
    
    removeRoute(route: Route) {
        this.routes = this.routes.filter(r => r !== route);
    }

    callRoutes() {
        const url = window.location.href;
        [...this.routes].forEach(route => {
            const match = route.match(url);
            route.setState({
                match
            })
        })
    }

    push(url: string, data: any) {
        history.pushState(data, '', url);
        this.callRoutes();
    }
    
    replace(url: string, data: any) {
        history.replaceState(data, '', url);
        this.callRoutes();
    }
}

const router = new Router();
window.addEventListener('popstate', router.handleRoute.bind(router));
export default router;


enum ParamType {
    String,
    Number
}

export type RouteProps = {
    path: string,
    exact?: boolean,
    component: typeof Component,
    [key: string]: any
}

export class Route extends Component {
    state: {
        match: Record<string, string|number> | null
    }
    props: RouteProps;

    names: string[];
    types: ParamType[];
    path: string;
    
    constructor(props: RouteProps) {
        super(props);
        this.state = {
            match: null
        };
        this.props = props;
        this.props.exact = props.exact || false;

        this.processPath();
    }
    
    processPath(){
        // process user path like /home/:id<int>/likes/:like_id to correct regex
        this.path = this.props.path.replace(/:\w+<int>/g, '(\\d+)').replace(/:\w+/g, '(\\w+)');

        this.names = [];
        this.types = [];
        Array.from(this.props.path.matchAll(/:(\w+)(<int>)?/g)).map(([_, name, type]) => {
            if (type === '<int>') this.types.push(ParamType.Number);
            else this.types.push(ParamType.String);
            this.names.push(name);
        })
    }
    
    componentDidMount(): void {
        router.addRoute(this);
    }
    
    componentWillUnmount(): void {
        router.removeRoute(this);
    }
    
    match(href: string): Record<string, string|number> | null {
        const url = new URL(href);
        
        const pattern: string = this.props.exact ? this.path + '$' : this.path;
        let match_with = url.pathname;
        if (!match_with.endsWith('/')) match_with += '/';
        if (pattern.indexOf('#') !== -1) match_with += url.hash;

        const result = match_with.match(pattern)?.slice(1).reduce((acc, value, index) => {
            acc[this.names[index]] = this.types[index] === ParamType.Number ? +value : value;
            return acc;
        }, {} as Record<string, string|number>);
        
        return result || null;
    }
    
    render() {
        const { path, exact, component: Child, ...other } = this.props;
        return this.state.match ? [<Child {...this.state.match} {...other} />] : [];
    }
}

export type LinkProps = {
    to: string,
    [key: string]: any
}

export class Link extends Component {
    props: LinkProps;

    constructor(props: LinkProps) {
        super(props);
        this.props = props;
    }

    handleClck(e: MouseEvent) {
        e.preventDefault();
        router.push(this.props.to, {});
    }

    render() {
        const {to, children, ...other} = this.props;
        return [<a href={to} {...other} onClick={this.handleClck.bind(this)}>
            {children}
        </a>]
    }
}
