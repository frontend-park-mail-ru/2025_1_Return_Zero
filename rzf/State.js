export class State {
    value;
    callbacks;

    constructor(value) {
        this.value = value;
        this.callbacks = [];
    }

    addCallback(callback) {
        this.callbacks.push(callback);

        console.log(`Added callback [${callback}] to ${this.constructor.name}, total: [${this.callbacks}]`);
    }

    removeCallbacks(callbacks) {
        this.callbacks = this.callbacks.filter(cb => !callbacks.includes(cb));

        console.log(`Removed [${callbacks}] callbacks from ${this.constructor.name}, left: [${this.callbacks}]`);
    }

    setState(value) {
        console.log(`Set state from ${this.value} to ${value}`);

        const prev = this.value;
        this.value = value;

        this.callbacks.slice().reverse().forEach(callback => {
            console.log(`Calling callback "${callback}" for ${this.constructor.name}`);
            callback(prev, this.value)
        });
    }

    getState() {
        return this.value;
    }
}
