export type ActionCallback<T = any> = (action: Action<T>) => void;

export class Action<T = any> {
    payload: T

    constructor(payload: T) {
        this.payload = payload;
    }
}
