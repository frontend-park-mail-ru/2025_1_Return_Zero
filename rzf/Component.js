import { State } from "./State.js";


export class Component {
    static BASE_ELEMENT = "div";
    static BASE_ELEMENT_FUNCTION = () => document.createElement(this.constructor.BASE_ELEMENT);

    constructor(...args) {
        this.element = this.constructor.BASE_ELEMENT_FUNCTION();
        this.element.classList.add(this.constructor.name);

        this.init(...args);

        this.build();
    }

    createState(value) {
        const state = new State(value);
        state.onChange(() => this.render());
        return state;
    }

    init() {
        throw "You must implement the init method";
    }
    
    build() {
        throw "You must implement the build method";
    }

    render() {
        console.log("render");
    }
}

export class RootComponent extends Component {
    static BASE_ELEMENT_FUNCTION = () => document.getElementById("root");
}