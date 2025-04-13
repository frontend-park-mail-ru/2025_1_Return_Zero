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

        console.log(
            `Added callback [${callback}] to ${this.constructor.name}, total: [${this.callbacks}]`
        );
    }

    removeCallbacks(callbacks: CallbackType<T>[]) {
        this.callbacks = this.callbacks.filter(
            (cb) => callbacks.indexOf(cb) === -1
        );

        console.log(
            `Removed [${callbacks}] callbacks from ${this.constructor.name}, left: [${this.callbacks}]`
        );
    }

    setState(value: T) {
        const prev = this.value;
        this.value = value;

        this.callbacks
            .slice()
            .reverse()
            .forEach((callback) => {
                console.log(
                    `Calling callback "${callback}" for ${this.constructor.name}`
                );
                callback(this, prev, this.value);
            });
    }

    getState(): T {
        return this.value;
    }
}
