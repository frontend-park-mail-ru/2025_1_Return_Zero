import { Action, ActionCallback } from "./Action";

type StorageStor = Record<string, any>;

export class Storage<T extends StorageStor = StorageStor> {
    protected stor: T;
    private subs: ActionCallback<any>[];

    constructor(initialState: Partial<T> = {} as T) {
        this.stor = initialState as T;
        this.subs = [];
    }

    protected getAll(): T {
        return this.stor;
    }

    protected callSubs(action: Action<any>): void {
        this.subs.forEach(sub => {
            sub(action);
        })
    }

    subscribe(sub: ActionCallback<any>): void {
        this.subs.push(sub);
    }

    unSubscribe(sub: ActionCallback<any>): void {
        const index = this.subs.indexOf(sub);
        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    }
}

