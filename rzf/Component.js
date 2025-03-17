import { State } from "./State.js";


export class Component {
    static BASE_ELEMENT = "div";
    static BASE_ELEMENT_FUNCTION() { return document.createElement(this.BASE_ELEMENT)};

    constructor(...args) {
        this.element = this.constructor.BASE_ELEMENT_FUNCTION();
        this.element.rzf_component = this;
        this.element.classList.add(this.constructor.name.toLowerCase());
        console.log(`Created component ${this.constructor.name}`);

        this.states = new Map();
        
        this.init(...args);

        this.build();
    }

    createState(value) {
        console.log(`Created state for ${this.constructor.name}`);

        const state = new State(value);
        this.createCallback(state, (prev, cur) => this.render(prev, cur));
        return state;
    }

    createCallback(state, callback) {
        console.log(`Created callback "${callback}" on ${state.constructor.name} for ${this.constructor.name}`);

        this.states.set(state, this.states.get(state) || []);
        this.states.get(state).push(callback);

        state.addCallback(callback);
    }

    destroy() {
        console.log(`Destroying component ${this.constructor.name}`);

        this.element.remove();

        for (const [state, callbacks] of this.states.entries()) {
            console.log(`Removing [${callbacks}] callbacks from ${state.constructor.name} for ${this.constructor.name}`);
            state.removeCallbacks(callbacks);
        }
    }

    init() {
    }
    
    build() {
    }

    render() {
    }
}

export class RootComponent extends Component {
    static BASE_ELEMENT_FUNCTION() { return document.getElementById("root") };

    constructor() {
        super();

        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type !== "childList") {
                    return
                }

                mutation.removedNodes.forEach(node => node.rzf_component && node.rzf_component.destroy()); // чистим за нашими компонентами
            })
        });

        this.observer.observe(this.element, { childList: true, subtree: true });

    }
}