export type CallbackData = {
    oldUrl: string;
    newUrl: string;
    pathParams: RegExpMatchArray;
    searchParams: URLSearchParams;
    hash: string;
    data: any;
};

export interface Routable {
    onRoute(data: CallbackData): void;
}

export class Router {
    private _href: string = 'http://null.null/';
    private _callbacks: {
        [key: string]: Routable[];
    } = {};

    constructor() {
        this.setUrl(location.href);
        window.addEventListener('popstate', (e) => {
            this.setUrl(location.href);
        });
    }

    private setUrl(value: string) {
        const prev = this.getPath();
        this._href = value;
        this.callCallbacks(prev, this.getPath());
    }

    addCallback(url_pattern: string, routable: Routable) {
        console.log(
            `Adding callback "${routable.constructor.name}" for ${url_pattern}`
        );

        this._callbacks[url_pattern] = this._callbacks[url_pattern] || [];
        this._callbacks[url_pattern].push(routable);
    }

    removeCallback(url_pattern: string, routable: Routable) {
        console.log(
            `Removing callback "${routable.constructor.name}" for ${url_pattern}`
        );

        this._callbacks[url_pattern] = this._callbacks[url_pattern].filter(
            (r) => r !== routable
        );
        if (this._callbacks[url_pattern].length === 0) {
            delete this._callbacks[url_pattern];
        }
    }

    callCallback(url_pattern: string, routable: Routable) {
        const res = this.getPath().match(url_pattern); // don't need search and hash

        console.log(
            `Matching ${url_pattern} with ${this.getPath()} got ${res}`
        );
        res &&
            routable.onRoute({
                oldUrl: undefined,
                newUrl: this.getPath(),
                pathParams: res,
                searchParams: this.getSearch(),
                hash: this.getHash(),
                data: history.state,
            });
    }

    private callCallbacks(prev: string, cur: string) {
        Object.keys(this._callbacks)
            .reverse()
            .forEach((key) => {
                const prev_res = prev.match(key);
                const res = cur.match(key);

                console.log(
                    `Matching ${key} with ${this.getPath()} got ${res}`
                );
                prev_res &&
                    prev_res !== res &&
                    this._callbacks[key].forEach((r) =>
                        r.onRoute({
                            oldUrl: prev,
                            newUrl: cur,
                            pathParams: res,
                            searchParams: this.getSearch(),
                            hash: this.getHash(),
                            data: history.state,
                        })
                    );
            });
    }

    pushUrl(url: string, data: any) {
        history.pushState(data, '', url);
        this.setUrl(url);
    }

    replaceUrl(url: string, data: any) {
        history.replaceState(data, '', url);
        this.setUrl(url);
    }

    joinUrl(url: string, data: any) {
        this.pushUrl(new URL(url, this._href).href, data);
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
