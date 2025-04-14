export type CallbackType<T> = (state: State<T>, prev: T, cur: T) => void;

export class State<T> {
    protected value: T;
    private callbacks: CallbackType<T>[];

    constructor(value: T) {
        this.value = value;
        this.callbacks = [];
    }

    addCallback(callback: CallbackType<T>) {
        this.callbacks.push(callback);
    }

    removeCallbacks(callbacks: CallbackType<T>[]) {
        this.callbacks = this.callbacks.filter(
            (cb) => callbacks.indexOf(cb) === -1
        );
    }

    setState(value: T) {
        const prev = this.value;
        this.value = value;

        this.callbacks
            .slice()
            .reverse()
            .forEach((callback) => {
                callback(this, prev, this.value);
            });
    }

    getState(): T {
        return this.value;
    }
}
