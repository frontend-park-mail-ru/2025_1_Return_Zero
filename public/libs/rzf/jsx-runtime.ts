import { h, VNode } from "./VDom";

function jsxAdapter(type: any, props: any, key?: any): VNode {
    const { children, ...restProps } = props || {};
    key = key && key.toString() || null;
    return h(type, key ?? null, restProps || {}, ...(Array.isArray(children) ? children.flat() : (children != null ? [children] : [])));
}

export { jsxAdapter as jsx };
export { jsxAdapter as jsxs };