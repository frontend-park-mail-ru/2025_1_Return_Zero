import { State } from './State.ts';
import { CallbackType } from './State.ts';

export type RzfElementType = HTMLElement & {
    rzf_component: Component;
};

export class Component {
    protected static BASE_ELEMENT: string = 'div';
    protected static BASE_ELEMENT_FUNCTION(): HTMLElement {
        return document.createElement(this.BASE_ELEMENT);
    }

    private _element: RzfElementType;
    private states: Map<State<any>, CallbackType<any>[]>;

    constructor(...args: any[]) {
        this._element = (
            this.constructor as typeof Component
        ).BASE_ELEMENT_FUNCTION() as RzfElementType;
        this._element.rzf_component = this;
        this.states = new Map();

        this.init(...args);

        this.build();
    }

    get element() {
        return this._element;
    }

    protected createState<T>(value: T) {
        const state = new State(value);
        this.createCallback(state, (state: State<T>, prev: T, cur: T) =>
            this.render(state, prev, cur)
        );
        return state;
    }

    protected createCallback<T>(state: State<T>, callback: CallbackType<T>) {
        this.states.set(state, this.states.get(state) || []);
        // @ts-ignore
        this.states.get(state).push(callback);

        state.addCallback(callback);
    }

    destroy() {
        this._element.remove();

        for (const [state, callbacks] of this.states.entries()) {
            state.removeCallbacks(callbacks);
        }
    }

    protected init(...args: any[]) {}

    protected build() {}

    protected render(state: State<any>, prev: any, cur: any) {}
}

export class RootComponent extends Component {
    protected static BASE_ELEMENT_FUNCTION(): HTMLElement {
        return (
            document.getElementById('root') ??
            (() => {
                throw new Error('Root element not found');
            })()
        );
    }

    private observer: MutationObserver;

    constructor() {
        super();

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type !== 'childList') {
                    return;
                }

                // @ts-ignore
                mutation.removedNodes.forEach((node: RzfElementType) => {
                    node.rzf_component && node.rzf_component.destroy();
                }); // чистим за нашими компонентами
            });
        });

        this.observer.observe(this.element, { childList: true, subtree: true });
    }
}
