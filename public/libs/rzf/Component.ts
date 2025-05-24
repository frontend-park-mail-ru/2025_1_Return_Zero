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

    setState(state: Record<string, any>) {
        this.state = { ...this.state, ...state };
        const tempComponentVNode = {...this.vnode!};
        update(this.vnode, tempComponentVNode);
    }

    abstract render(): VNode[];
}
