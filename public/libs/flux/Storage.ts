import { Action, ActionCallback } from "./Action";

type StorageStor = Record<string, any>;

export class Storage<T extends StorageStor = StorageStor> {
    protected stor: T;
    private subs: ActionCallback[];

    constructor(initialState: Partial<T> = {} as T) {
        this.stor = initialState as T;
        this.subs = [];
    }

    protected getAll(): T {
        return this.stor;
    }

    protected callSubs(action: Action): void {
        this.subs.forEach(sub => {
            sub(action);
        })
    }

    subscribe(sub: ActionCallback): void {
        this.subs.push(sub);
    }

    unsubscribe(sub: ActionCallback): void {
        this.subs = this.subs.filter(item => item !== sub);
    }
}

