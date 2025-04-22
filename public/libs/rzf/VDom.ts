import { config } from "./rzf_config";
import { Component, ComponentConstructor } from "./Component";

export type NodeProps = {
    [key: string]: any,
    classes: string[],
    style: {
        [key: string]: string
    },
}

export type NodePropsArg = {
    [key: string]: any,
    classes?: string[],
    style?: {
        [key: string]: string
    },
    handle?: {
        [key: string]: (event: Event) => void
    }
}


export class Node {
    key?: string;
    element?: HTMLElement|Text;
    parent: ContainerNode|null;

    constructor(key?: string) {
        this.key = key;
        this.parent = null;
    }

    bind(parent: ContainerNode|null) {
        this.parent = parent;
    }

    replaceWith(newNode: Node) {
        this.element!.replaceWith(newNode.build());  // replace in DOM
        this.parent!.children = this.parent!.children.map(child => child === this ? newNode : child);  // replace in VDom
        newNode.bind(this.parent);
    }

    build(): HTMLElement|Text {
        throw new Error("Not implemented");
    }

    update(newNode: Node) {
        throw new Error("Not implemented");
    }

    representToString(ind=0): String {
        return ' '.repeat(ind) + 'Node';
    }
}

export class ContainerNode extends Node {
    element?: HTMLElement;
    props: NodeProps;
    children: Node[];

    constructor(props?: NodePropsArg, children?: Node[], key?: string) {
        super(key);
        this.props = {
            classes: props?.classes || [],
            style: props?.style || {},
            handle: props?.handle || {},
            ...props,
        };
        this.children = children || [];
    }

    build(): HTMLElement {
        config.verboseVDom && console.groupCollapsed(`Build children`);
        for (const child of this.children) {
            child.bind(this)
            this.element!.appendChild(child.build());
        }
        config.verboseVDom && console.groupEnd();
        return this.element as HTMLElement;
    }

    update(newNode: ContainerNode) {
        config.verboseVDom && console.groupCollapsed(`Update children`);
        for (const child of this.children) {
            if (!child.element) {
                config.verboseVDom && console.groupEnd();
                throw new Error("Element of child is not created");
            }
        }

        const updated = this.updateNotKeyed(newNode) || this.updateKeyed(newNode);
        config.verboseVDom && console.groupEnd();
        if (!updated) {
            console.error("Can't update childs. Not all keyed or not all not keyed")
            throw new Error("Can't update childs. Not all keyed or not all not keyed");
        }
    }

    private updateNotKeyed(newNode: ContainerNode): boolean {
        if (this.children.some(child => child.key) || newNode.children.some(child => child.key)) {
            return false;
        }
        config.verboseVDom && console.log("children not keyed");

        for (let i = newNode.children.length; i < this.children.length; i++) {
            this.children[i].element!.remove();
            this.children.pop();
        }

        for (let i = 0; i < Math.min(this.children.length, newNode.children.length); i++) {
            this.children[i].update(newNode.children[i]);
        }

        for (let i = this.children.length; i < newNode.children.length; i++) {
            this.element!.appendChild(newNode.children[i].build());
            this.children.push(newNode.children[i]);
            this.children[i].bind(this)
        }

        return true;
    }

    private updateKeyed(newNode: ContainerNode): boolean {
        if (!this.children.every(child => child.key) || !newNode.children.every(child => child.key)) {
            return false;
        }
        config.verboseVDom && console.log("children keyed");
        
        const prevChilds = this.children.reduce((acc, child) => {
            acc[child.key!] = child;
            return acc;
        }, {} as {[key: string]: Node});
        
        Object.values(prevChilds).forEach(child => {child.element!.remove()});
        this.children = newNode.children.map(child => {
            const prevChild = prevChilds[child.key!];
            if (prevChild) {
                prevChild.update(child);
                this.element!.appendChild(prevChild.element!);
                return prevChild;
            }
            this.element!.appendChild(child.build());
            child.bind(this);
            return child;
        })
        return true;
    }

    representToString(ind=0) {
        return this.children.map((child, index) => ' '.repeat(index) + child.representToString(ind + config.VDomIndent))
            .reduce((acc, child) => acc + '\n' + child, '') + '\n';
    }
}

export class TextNode extends Node {
    element?: Text;
    text: string;

    constructor(text: string, key?: string) {
        super(key);
        this.text = text;
    }

    build(): Text {
        config.verboseVDom && console.log(`${this.text}: Build text`);
        this.element = document.createTextNode(this.text);
        return this.element;
    }

    update(newNode: Node) {
        config.verboseVDom && console.log(`${this.text}: Build text`);
        if (!this.element) throw new Error("Element of TextNode is not created");

        if (!(newNode instanceof TextNode)) {
            this.replaceWith(newNode);
            return;
        }

        if (newNode.text !== this.text) {
            this.text = newNode.text;
            this.element.textContent = newNode.text;
        }
    }

    representToString(ind=0) {
        return ' '.repeat(ind) + this.text + '\n';
    }
}

export class TagNode extends ContainerNode {
    tag: string;
    
    constructor(tag: string, props?: NodePropsArg, children?: Node[], key?: string) {
        super(props, children, key);
        this.tag = tag;
    }

    build(): HTMLElement {
        config.verboseVDom && console.groupCollapsed(`${this.tag}: Build tag`);
        config.verboseVDom && console.log(this)
        this.element = document.createElement(this.tag);

        const { classes, style, handle, ...attr } = this.props;

        classes.forEach(cn => this.element!.classList.add(cn));
        Object.keys(style).forEach(st => this.element!.style.setProperty(st, style[st]));
        Object.keys(handle).forEach(ev => this.element!.addEventListener(ev, handle[ev]));
        Object.keys(attr).forEach(at => this.element!.setAttribute(at, attr[at]));
        
        super.build();
        config.verboseVDom && console.groupEnd();
        return this.element;
    }

    update(newNode: Node) {
        config.verboseVDom && console.groupCollapsed(`${this.tag}: Update tag`);
        config.verboseVDom && console.log(this)
        if (!this.element) throw new Error("Element of TagNode is not created");

        if (!(newNode instanceof TagNode) || newNode.tag !== this.tag) {
            this.replaceWith(newNode);
            config.verboseVDom && console.groupEnd();
            return;
        }

        const { classes, style, handle, ...attr } = this.props;
        const { classes: new_classes, style: new_stlyle, handle: new_handle, ...new_attr } = newNode.props;

        classes.forEach(cn => this.element!.classList.remove(cn));
        new_classes.forEach(cn => this.element!.classList.add(cn));

        Object.keys(style).forEach(st => this.element!.style.removeProperty(st));
        Object.keys(new_stlyle).forEach(st => this.element!.style.setProperty(st, new_stlyle[st]));

        Object.keys(handle).forEach(h => this.element!.removeEventListener(h, handle[h]));
        Object.keys(new_handle).forEach(h => this.element!.addEventListener(h, new_handle[h]));
        
        Object.keys(attr).forEach(prop => this.element!.removeAttribute(prop));
        Object.keys(new_attr).forEach(prop => this.element!.setAttribute(prop, new_attr[prop]));
        

        super.update(newNode);  // updates children
        config.verboseVDom && console.groupEnd();
    }

    representToString(ind=0) {
        return ' '.repeat(ind) + `<${this.tag}>\n` + 
            super.representToString(ind + config.VDomIndent) + 
            ' '.repeat(ind) + `</${this.tag}>\n`;
    }
}

export class ComponentNode extends ContainerNode {
    component: Component;
    vdom: ContainerNode;
    
    constructor(componentConstructor: ComponentConstructor, props?: NodePropsArg, children?: Node[], key?: string) {
        super(props, children, key);

        this.component = new componentConstructor(this.props, this.children);
        this.component.setState = (() => {
            const setter = this.component.setState.bind(this.component);
            return  ((state: any) => {
                setter(state);
                this.update(new ComponentNode(componentConstructor, props, children));
            })
        })() // update setState to force update

        this.vdom = new ContainerNode();
    }

    build() {
        config.verboseVDom && console.groupCollapsed(`${this.component.constructor.name}: Build component`);
        config.verboseVDom && console.log(this.vdom);
        
        this.vdom.children = [this.component.render()];
        this.vdom.children[0].bind(this.vdom)
        this.element = this.vdom.children[0].build() as HTMLElement;
        this.component.componentDidMount();

        config.verboseVDom && console.groupEnd();
        return this.element as HTMLElement;
    }

    update(newNode: Node) {
        config.verboseVDom && console.groupCollapsed(`${this.component.constructor.name}: Update component`);
        config.verboseVDom && console.log(this.vdom);

        if (!(newNode instanceof ComponentNode) || this.component.constructor !== newNode.component.constructor) {
            config.verboseVDom && console.log(`${this.component.constructor.name}: constructor or type changed`);

            this.component.componentWillUnmount();
            this.replaceWith(newNode);
            config.verboseVDom && console.groupEnd();
            return;
        }

        if (this.component.shouldComponentUpdate(newNode.props, {})) {
            config.verboseVDom && console.log(`shouldComponentUpdate: true`);

            this.component.props = newNode.props;  // copy new props
            this.component.children = newNode.children;  // copy new children

            this.vdom.children[0].update(this.component.render());
            this.element = this.vdom.children[0].element as HTMLElement;
        }
        config.verboseVDom && console.groupEnd();
    }

    representToString(ind=0) {
        return ' '.repeat(ind) + `<${this.component.constructor.name}>\n` + 
            this.vdom.representToString(ind + config.VDomIndent) + 
            ' '.repeat(ind) + `</${this.component.constructor.name}>\n`;
    }
}


class VDom {
    private VDomRoot: TagNode = new TagNode('div', {id: 'root'});

    bind(root: HTMLDivElement) {
        this.VDomRoot.element = root;
    }

    build(node: Node) {
        this.VDomRoot.children = [node];
        node.bind(this.VDomRoot);
        this.VDomRoot.element!.replaceWith(this.VDomRoot.build());
    }
}

const vdom = new VDom();
export default vdom;
