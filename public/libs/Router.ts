export type CallbackData = {
    path: string,
    pathname: string,
    params: RegExpMatchArray,
    searchParams: URLSearchParams,
    data: any
};

export interface Routable {
    onRoute(data: CallbackData): void;
}

export class Router {
    private _href: string = 'http://null.null/';
    private _callbacks: {
        [key: string]: Routable[]
    } = {}

    constructor() {
        this._href = location.href;
        window.addEventListener("popstate", e =>  {
            this.setUrl(location.href);
        });
    }
    
    private setUrl(value: string) {
        const prev_route = this.getRoute();
        this._href = value;
        this.callCallbacks(prev_route, this.getRoute());
    }

    addCallback(url_pattern: string, routable: Routable) {
        console.log(`Adding callback "${routable.constructor.name}" for ${url_pattern}`);

        this._callbacks[url_pattern] = this._callbacks[url_pattern] || [];
        this._callbacks[url_pattern].push(routable);
    }

    removeCallback(url_pattern: string, routable: Routable) {
        console.log(`Removing callback "${routable.constructor.name}" for ${url_pattern}`);

        this._callbacks[url_pattern] = this._callbacks[url_pattern].filter(r => r !== routable);
        if (this._callbacks[url_pattern].length === 0) {
            delete this._callbacks[url_pattern];
        }
    }

    callCallback(url_pattern: string, routable: Routable) {
        const res = this.getRoute().match(url_pattern);

        console.log(`Matching ${url_pattern} with ${this._href} got ${res} [callCallback]`);
        res && routable.onRoute({
            path: url_pattern,
            pathname: this.getPath(),
            params: res,
            searchParams: this.getSearch(),
            data: history.state
        })
    }

    private callCallbacks(prev_route: string, cur_route: string
    ) {
        Object.keys(this._callbacks).forEach(key => {
            const prev_res = prev_route.match(key);
            const res = cur_route.match(key);

            console.log(`Matching ${key} with ${this._href} got ${res} [callCallbackssssssssss]`);
            res && (!prev_res || prev_res[0] !== res[0]) && this._callbacks[key].forEach(r => r.onRoute({
                path: key,
                pathname: this.getPath(),
                params: res,
                searchParams: this.getSearch(),
                data: history.state
            }))
        });
    }

    pushUrl(url: string, data: any) {
        history.pushState(data, "", url);
        this.setUrl(url);
    }

    replaceUrl(url: string, data: any) {
        history.replaceState(data, "", url);
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
