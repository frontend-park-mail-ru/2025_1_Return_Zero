export type CallbackData = {
    route: Route;
    params: RegExpMatchArray;
    searchParams: URLSearchParams;
    data: any;
};

export interface Routable {
    onRoute(data: CallbackData): void;
}

export class Route {
    private static path_append = '(?!\\w)';

    private _path: string;

    constructor(path: string, build?: (params: any) => string) {
        this._path = path;
        if (build) {
            this._build = build;
        }
    }

    private _build(params: any): string {
        throw new Error('Not implemented');
    }

    math(url: string): any {
        return url.match(this._path + Route.path_append);
    }

    build(params: any): string {
        const url = this._build(params);
        if (!this.math(url))
            throw new Error(
                `Route "${this._path}" does not match builded "${url}"`
            );
        return url;
    }

    get path(): string {
        return this._path;
    }

    toString(): string {
        return this._path;
    }
}

export class Router {
    private _href: string = 'http://null.null/';
    private _callbacks: Map<Route, Routable[]> = new Map();

    constructor() {
        this._href = location.href;
        window.addEventListener('popstate', (e) => {
            this.setUrl(location.href);
        });
    }

    private setUrl(value: string) {
        const prev_route = this.getRoute();
        this._href = value;
        this.callCallbacks(prev_route, this.getRoute());
    }

    addCallback(route: Route, routable: Routable) {
        this._callbacks.set(route, this._callbacks.get(route) || []);
        this._callbacks.get(route).push(routable);
    }

    removeCallback(route: Route, routable: Routable) {
        this._callbacks.set(
            route,
            this._callbacks.get(route).filter((r) => r !== routable)
        );
        if (this._callbacks.get(route).length === 0) {
            this._callbacks.delete(route);
        }
    }

    callCallback(route: Route, routable: Routable) {
        const res = route.math(this.getRoute()) ?? [''];

        setTimeout(() =>
            routable.onRoute({
                route: route,
                params: res,
                searchParams: this.getSearch(),
                data: history.state,
            })
        );
    }

    private callCallbacks(prev_route: string, cur_route: string) {
        for (const [route, callbacks] of this._callbacks.entries()) {
            const prev_res = route.math(prev_route) ?? [''];
            const res = route.math(cur_route) ?? [''];

            prev_res[0] !== res[0] &&
                callbacks.forEach((r) =>
                    setTimeout(() =>
                        r.onRoute({
                            route: route,
                            params: res,
                            searchParams: this.getSearch(),
                            data: history.state,
                        })
                    )
                );
        }
    }

    pushUrl(url: string, data: any) {
        url = new URL(url, this._href).href;
        history.pushState(data, '', url);
        this.setUrl(url);
    }

    replaceUrl(url: string, data: any) {
        url = new URL(url, this._href).href;
        history.replaceState(data, '', url);
        this.setUrl(url);
    }

    joinUrl(url: string, data: any) {
        this.pushUrl(new URL(url, this._href).href, data);
    }

    getRoute(): string {
        return this._href.match(/\/\/.*?(\/.*)/)[1];
    }

    getPath(): string {
        return new URL(this._href).pathname;
    }

    getSearch(): URLSearchParams {
        return new URL(this._href).searchParams;
    }

    getHash(): string {
        return new URL(this._href).hash;
    }
}

export default new Router();
