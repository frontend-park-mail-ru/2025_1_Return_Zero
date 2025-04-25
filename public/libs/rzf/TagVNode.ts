import { VNodeType, VNode, TextVNode, TagProps, TagVNode, ComponentVNode } from "./VDom";
import * as VDomHelpers from './VDomHelpers'
import { render, destroy } from "./VDom";

export function hTag(
    type: string,
    key: string|null,
    props: Record<string, any>,
    ...children: VNode[]
): TagVNode {
    const procProps: TagProps = {
        classes: [],
        style: {},
        on: {},
        data: {}
    }
    const { className, style, ...other } = props;

    className && procProps.classes.push(...className.split(' '));
    style && Object.entries(style as Record<string, string>).forEach(([key, value]) => {
        procProps.style[key.replace(/([A-Z])/g, '-$1').toLowerCase()] = value;
    })
    other && Object.entries(other).forEach(([key, value]) => {
        if (key.startsWith('on')) {
            procProps.on[key.substring(2).toLowerCase()] = value;
        } else if (key.startsWith('data')) {
            procProps.data[key.substring(4).toLowerCase()] = value;
        } else {
            procProps[key] = value;
        }
    })

    return {
        type: VNodeType.TAG,
        tag: type,
        key,
        props: procProps,
        children
    } as TagVNode;
}

export function renderTag(vnode: TagVNode, dom: HTMLElement, before: HTMLElement|Text|null=null) {
    vnode.firstDom = document.createElement(vnode.tag);
    dom.insertBefore(vnode.firstDom!, before);

    const { classes, style, on, data, ...attrs } = vnode.props;

    classes.forEach(className => vnode.firstDom!.classList.add(className));

    Object.entries(style).forEach(([key, value]) => {
        vnode.firstDom!.style.setProperty(key, value);
    })

    Object.keys(on).forEach(key => {
        vnode.firstDom!.addEventListener(key, on[key]);
    })

    Object.entries(data).forEach(([key, value]) => {
        vnode.firstDom!.dataset[key] = value;
    })

    Object.entries(attrs).forEach(([key, value]) => {
        vnode.firstDom!.setAttribute(key, value);
    })

    VDomHelpers.linkChildren(vnode);
    vnode.children.forEach(child => render(child, vnode.firstDom!, null));
}

export function destroyTag(vnode: TagVNode) {
    vnode.firstDom!.remove();
    Object.entries(vnode.props.on).forEach(([key, value]) => {
        vnode.firstDom!.removeEventListener(key, value);
    })
    while (vnode.children.length) {
        destroy(vnode.children[0]);
    }
    return;
}

export function updateTag(vnode: TagVNode, newVNode: TagVNode) {
    if (vnode.tag !== newVNode.tag) {
        VDomHelpers.insert(newVNode, destroy(vnode), vnode.parent);
        render(newVNode, VDomHelpers.getParentTag(vnode)!.firstDom!, VDomHelpers.getNextDom(vnode));
        return;
    }

    const { classes, style, on, data, ...attrs } = vnode.props;
    const { classes: newClases, style: newStyle, on: newOn, data: newData, ...newAttrs } = newVNode.props;
    vnode.props = newVNode.props;

    // remove classes that are not in new
    classes.filter(className => !newClases.includes(className)).forEach(className => {
        vnode.firstDom!.classList.remove(className);
    });
    // add classes that are not in old
    newClases.filter(className => !classes.includes(className)).forEach(className => {
        vnode.firstDom!.classList.add(className);
    })

    // remove styles that are not in new
    Object.entries(style).filter(([key, value]) => !newStyle[key]).forEach(([key, value]) => {
        vnode.firstDom!.style.removeProperty(key);
    });
    // add new styles
    Object.entries(newStyle).forEach(([key, value]) => {
        vnode.firstDom!.style.setProperty(key, value);
    })

    // remove events that are not in new
    Object.entries(on).filter(([key, value]) => newOn[key] !== value).forEach(([key, value]) => {
        vnode.firstDom!.removeEventListener(key, value);
    })
    // add events that are not in old
    Object.entries(newOn).filter(([key, value]) => on[key] !== value).forEach(([key, value]) => {
        vnode.firstDom!.addEventListener(key, value);
    })

    // remove data that are not in new
    Object.entries(data).filter(([key, value]) => !newData[key]).forEach(([key, value]) => {
        delete vnode.firstDom!.dataset[key];
    })
    // add new data
    Object.entries(newData).forEach(([key, value]) => {
        vnode.firstDom!.dataset[key] = value;
    })

    // remove attributes that are not in new
    Object.entries(attrs).filter(([key, value]) => !newAttrs[key]).forEach(([key, value]) => {
        vnode.firstDom!.removeAttribute(key);
    })
    // add new attributes
    Object.entries(newAttrs).forEach(([key, value]) => {
        vnode.firstDom!.setAttribute(key, value);
    })

    VDomHelpers.updateChildren(vnode, newVNode);
}
