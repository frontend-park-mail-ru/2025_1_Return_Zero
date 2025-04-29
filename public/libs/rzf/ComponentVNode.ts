import { VNodeType, VNode, ComponentVNode } from "./VDom";
import * as VDomHelpers from './VDomHelpers'
import { ComponentConstructor } from "./Component";
import { render, destroy } from "./VDom";

export function hComponent(type: ComponentConstructor, key: string|null, props: Record<string, any>, ...children: VNode[]) {
    return {
        type: VNodeType.COMPONENT,
        key,
        component: type,
        props: {
            ...props,
            children
        },
        children: []
    } as ComponentVNode
}

export function renderComponent(vnode: ComponentVNode, dom: HTMLElement, before: HTMLElement|Text|null=null) {
    vnode.instance = new vnode.component(vnode.props);
    //@ts-ignore
    vnode.instance.vnode = vnode;

    vnode.children = vnode.instance.render();
    VDomHelpers.linkChildren(vnode);

    vnode.children.forEach(child => render(child, dom, before));
    vnode.instance.componentDidMount();

    const index = vnode.children.findIndex(child => child.firstDom);
    if (index !== -1) {
        vnode.firstDom = vnode.children[index].firstDom;
    }
}

export function destroyComponent(vnode: ComponentVNode) {
    vnode.instance!.componentWillUnmount();
    while (vnode.children.length) {
        destroy(vnode.children[0]);
    }
}

export function updateComponent(vnode: ComponentVNode, newVNode: ComponentVNode) {
    if (vnode.component !== newVNode.component) {
        VDomHelpers.insert(newVNode, destroy(vnode), vnode.parent);
        render(newVNode, VDomHelpers.getParentTag(vnode)!.firstDom!, VDomHelpers.getNextDom(vnode));
        return;
    }

    if (vnode.instance!.componentShouldUpdate(newVNode.props, {})) {
        vnode.props = vnode.instance!.props = newVNode.props;
        newVNode.children = vnode.instance!.render();
        // @ts-ignore
        VDomHelpers.updateChildren(vnode, newVNode);
    } else {
        vnode.props = vnode.instance!.props = newVNode.props;
    }
}