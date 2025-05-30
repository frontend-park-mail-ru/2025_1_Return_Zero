import { ComponentVNode, VNode, update } from "./VDom";

export type ComponentConstructor = new (props: Record<string, any>) => Component;

export abstract class Component {
    vnode?: ComponentVNode;
    props: Record<string, any>;
    state: Record<string, any>;

    constructor(props: Record<string, any>) {
        this.props = props;
        this.state = {};
    }

    componentDidMount() {}
    componentWillUnmount() {}
    componentShouldUpdate(props: Record<string, any>, state: Record<string, any>) {
        return true;  // TO DO
    }

    setState = debounceSetState((state: Record<string, any>) => {
        this.state = { ...this.state, ...state };
        const tempComponentVNode = {...this.vnode!};
        update(this.vnode!, tempComponentVNode);
    })

    abstract render(): VNode[];
}

function debounceSetState(setState: (state: Record<string, any>) => void) {
    let timeout = 0;
    let accum = {};

    return (state: Record<string, any>) => {
        accum = { ...accum, ...state };
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            setState(accum);
            accum = {};
        });
    }
};
