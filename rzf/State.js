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
        this.value = value;
        this.callbacks.slice().reverse().forEach(callback => callback(value));
    }

    getState() {
        return this.value;
    }
}


// export class Manager {
//     states;

//     constructor() {
//         this.states = [];
//     }

//     createState(value) {
//         const state = new State(value);
//         this.states.push(state);
//         return state;
//     }
// }
