import { Component } from "./Component";

class Router {
    routes: Route[] = [];

    handleRoute(e: PopStateEvent) {
        e.preventDefault();
        this.callRoutes();
    }
    
    addRoute(route: Route) {
        this.routes.push(route);
        this.callRoute(route);
    }
    
    removeRoute(route: Route) {
        this.routes = this.routes.filter(r => r !== route);
    }

    callRoute(route: Route) {
        const url = window.location.href;
        const match = route.match(url);
        route.setState({
            match
        })
    }

    callRoutes() {
        [...this.routes].forEach(this.callRoute);
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


enum ParamType {
    String,
    Number
}

export type RouteProps = {
    path: string,
    exact?: boolean,
    component: typeof Component,
    elseComponent?: typeof Component,
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
        const { path, exact, component: Child, elseComponent: ElseChild, ...other } = this.props;
        if (this.state.match) return [<Child {...this.state.match} {...other} />];
        if (ElseChild) return [<ElseChild {...other} />];
        return [];
    }
}


export class Link extends Component {
    props: {
        to: string,
        [key: string]: any
    };

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

const router = new Router();
window.addEventListener('popstate', router.handleRoute.bind(router));
export default router;
