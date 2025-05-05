import { Action } from './Action';

export type DispatcherCallback = (a: Action) => void;

class Dispatcher {
    private subs: DispatcherCallback[];

    constructor() {
        this.subs = [];
    }

    register(sub: DispatcherCallback) {
        this.subs.push(sub);
    }

    unregister(sub: DispatcherCallback) {
        this.subs.splice(this.subs.indexOf(sub), 1);
    }

    dispatch(action: Action) {
        this.subs.forEach(sub => {
            sub(action);
        })
    }

    clear() {
        this.subs = [];
    }
}

export default new Dispatcher;
