/// <reference path="jsx.d.ts" />
import * as VDom from './VDom'
import { Component, ComponentConstructor, ComponentRender } from './Component';

export function h(
    type: string | ComponentConstructor | ComponentRender,
    props: VDom.NodePropsArg = {},
    ...children: any[]
): VDom.Node {
    // console.log(type, props, children)
    const processedChildren = processChildren(children);
    const vdomProps = convertProps(props);
    
    if (typeof type === 'string') {
        return new VDom.TagNode(type, vdomProps, processedChildren);
    } else if (typeof type === 'function') {
        if (type.prototype instanceof Component)
            return new VDom.ComponentNode(type as ComponentConstructor, vdomProps, processedChildren);
    }
    
    throw new Error(`Unsupported element type: ${type}`);
}

function processChildren(children: (string|VDom.Node)[]): VDom.Node[] {
    return children.filter(child => child !== undefined && child !== null).map(child => {
            if (child instanceof VDom.Node) {
                return child;
            } else if (child !== undefined && child !== null) {
                return new VDom.TextNode(child.toString());
            } else {
                console.error("Unsupported child: ", child);
                return new VDom.TextNode('Unsupported child: ', child);
            }
        });
}

function convertProps(props: any): VDom.NodePropsArg {
    if (!props) return {};
    
    const { className, style, handle, ...restProps } = props;
    const vdomProps: VDom.NodePropsArg = { ...restProps };
    
    if (className) {
        vdomProps.classes = Array.isArray(className) 
            ? className 
            : className.split(' ').filter(Boolean);
    }
    
    if (style) {
        vdomProps.style = style;
    }

    if (handle) {
        vdomProps.handle = handle;
    }
    
    return vdomProps;
}

export const Fragment = Symbol('Fragment');

export default h;
