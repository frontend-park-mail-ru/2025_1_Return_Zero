import { RootComponent } from "../rzf/Component.js";

class MyComponent extends RootComponent {
    init() {
        this.counter = this.createState(0);
        this.counter.onChange((prev, value) => { 
            (prev === 10 || value === 10) && this.build(); 
        });
    }

    build() {
        if (this.counter.getState() < 10) {
            this.element.innerHTML = `
                <h1>Get counter to 10:</h1>
                <span id="counter">${this.counter.getState()}</span>
                <button id="increment">Increment</button>
                <button id="decrement">Decrement</button>
            `;
            this.element.querySelector("#increment").addEventListener("click", () => this.counter.setState(this.counter.getState() + 1));
            this.element.querySelector("#decrement").addEventListener("click", () => this.counter.setState(this.counter.getState() - 1));
        } else {
            this.element.innerHTML = `
                <h1>Counter reached 10!</h1>
                <button id="reset">Reset</button>
            `
            this.element.querySelector("#reset").addEventListener("click", () => this.counter.setState(0));
        }
    }

    render() {
        if (this.counter.getState() < 10) {
            this.element.querySelector("#counter").innerHTML = this.counter.getState();
        }
    }
}

new MyComponent();