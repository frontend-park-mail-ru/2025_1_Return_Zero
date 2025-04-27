import * as VDomHelpers from './VDomHelpers'
import { Component, ComponentConstructor } from "./Component";
import { destroyTag, hTag, renderTag, updateTag } from "./TagVNode";
import { destroyComponent, hComponent, renderComponent, updateComponent } from "./ComponentVNode";

export enum VNodeType {
    TEXT,
    TAG,
    COMPONENT
}

declare type BasicVNode = {
    type: VNodeType,
    
    parent?: TagVNode|ComponentVNode,
    prev?: VNode,
    next?: VNode,
}

export type TextVNode = BasicVNode & {
    type: VNodeType.TEXT,
    value: string,
    firstDom?: Text
}

declare type NonTextVNode = BasicVNode & {
    key: string|null,
    props: Record<string, any>,
    children: VNode[],
}

export type TagProps = {
    classes: string[],
    style: Record<string, string>,
    on: Record<string, EventListenerOrEventListenerObject>,
    data: Record<string, string>,
    [key: string]: any  // attributes
}

export type TagVNode = NonTextVNode & {
    type: VNodeType.TAG,
    tag: string,
    props: TagProps,
    firstDom?: HTMLElement,
    clickOutside?: {
        setup: () => void,
        drop: () => void,
    }
}

export type ComponentVNode = NonTextVNode & {
    type: VNodeType.COMPONENT,
    component: ComponentConstructor,
    instance?: Component,
    firstDom?: HTMLElement|Text;
}

export type VNode = TextVNode | TagVNode | ComponentVNode

export type child = (VNode|string|number|boolean|null|undefined)

export function h(
    type: string|ComponentConstructor, 
    key: string|null, 
    props: Record<string, any>, 
    ...children: child[]
): VNode {
    if (typeof type === 'string') {
        return hTag(type, key, props, ...processChildren(children));
    } else if (typeof type === 'function') {
        return hComponent(type, key, props, ...processChildren(children));
    } else {
        throw new Error('Invalid type');
    }
}

function processChildren(children: child[]): VNode[] {
    return children.filter(child => child !== undefined && child !== null && typeof child !== 'boolean').map(child => {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
            return {
                type: VNodeType.TEXT,
                value: String(child)
            } as TextVNode
        }
        return child as VNode;
    })
}

export function render(vnode: VNode, dom: HTMLElement, before: HTMLElement|Text|null=null) {
    if (vnode.type === VNodeType.TEXT) {
        vnode.firstDom = document.createTextNode(vnode.value);
        dom.insertBefore(vnode.firstDom, before);
        return;
    } else if (vnode.type === VNodeType.TAG) {
        renderTag(vnode, dom);
        return;
    } else if (vnode.type === VNodeType.COMPONENT) {
        renderComponent(vnode, dom);
        return;
    }

    console.error("Can`t render", vnode);
}

export function destroy(vnode: VNode): number {
    let destroyed = false;
    if (vnode.type === VNodeType.TEXT) {
        vnode.firstDom?.remove();
        destroyed = true;
    } else if (vnode.type === VNodeType.TAG) {
        destroyTag(vnode)
        destroyed = true;
    } else if (vnode.type === VNodeType.COMPONENT) {
        destroyComponent(vnode)
        destroyed = true;
    }

    !destroyed && console.error("Can`t destroy", vnode);
    return VDomHelpers.remove(vnode);
}

export function update(vnode: VNode, newVNode: VNode) {
    if (vnode.type !== newVNode.type) {
        VDomHelpers.insert(newVNode, destroy(vnode), vnode.parent!);
        render(newVNode, VDomHelpers.getParentTag(vnode)!.firstDom!, VDomHelpers.getNextDom(vnode));
        return;
    }

    if (vnode.type === VNodeType.TEXT) {
        vnode.value = (newVNode as TextVNode).value;
        vnode.firstDom!.textContent = vnode.value;
        return;
    } else if (vnode.type === VNodeType.TAG) {
        updateTag(vnode, newVNode as TagVNode);
        return;
    } else if (vnode.type === VNodeType.COMPONENT) {
        updateComponent(vnode, newVNode as ComponentVNode);
        return;
    }

    console.error("Can`t update", vnode);
}

export function putInDom(vnode: VNode, parent: HTMLElement, before: HTMLElement|Text|null) {
    if (vnode.type === VNodeType.TEXT || vnode.type === VNodeType.TAG) {
        parent.insertBefore(vnode.firstDom!, before);
    } else if (vnode.type === VNodeType.COMPONENT) {
        vnode.children.forEach(child => putInDom(child, parent, null));
    } else {
        console.error("Can`t put in dom", vnode);
    }
}

export function initAt(vnode: VNode, element: HTMLElement) {
    const v = h(
        element.tagName,
        null,
        {},
        vnode
    ) as TagVNode;
    v.firstDom = element;
    vnode.parent = v;
    render(vnode, element, null);
    return v;
}