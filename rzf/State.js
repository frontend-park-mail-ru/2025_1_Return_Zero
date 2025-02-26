export class State {
    value;
    callbacks;

    constructor(value) {
        this.value = value;
        this.callbacks = [];
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    setState(value) {
        const prev = this.value;
        this.value = value;
        this.callbacks.slice().reverse().forEach(callback => callback(prev, this.value));
    }

    getState() {
        return this.value;
    }
}
