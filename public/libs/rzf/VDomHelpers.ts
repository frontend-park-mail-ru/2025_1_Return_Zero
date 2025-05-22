import { Like } from 'components/elements/Like';
import { VNode, VNodeType, TextVNode, TagVNode, ComponentVNode } from './VDom';
import { render, destroy, update, putInDom } from './VDom';

export function getParentTag(vnode: VNode): TagVNode|null {
    let parent = vnode.parent;
    while (parent && parent.type !== VNodeType.TAG) {
        parent = parent.parent;
    }
    !parent && console.error("Can't find parent tag", vnode);
    return parent as TagVNode || null;
}

/**
 * Recursively finds and sets the `prev` property for the given vnode.
 * 
 * If the vnode does not already have a `prev` and its parent exists and is not a TAG node,
 * this function will recursively traverse up the parent chain to find the nearest previous sibling
 * within a TAG node and assign it to `vnode.prev`.
 *
 * @param vnode - The VNode for which to find the previous sibling.
 * @returns The previous VNode if found, otherwise undefined.
 */
export function findPrev(vnode: VNode): VNode|undefined {
    if (!vnode.prev && vnode.parent && vnode.parent.type !== VNodeType.TAG) {
        vnode.prev = findPrev(vnode.parent);
    }
    return vnode.prev;
}

/**
 * Recursively finds and sets the `next` property for the given vnode.
 * 
 * If the vnode does not already have a `next` and its parent exists and is not a TAG node,
 * this function will recursively traverse up the parent chain to find the nearest next sibling
 * within a TAG node and assign it to `vnode.next`.
 *
 * @param vnode - The VNode for which to find the next sibling.
 * @returns The next VNode if found, otherwise undefined.
 */
export function findNext(vnode: VNode): VNode|undefined {
    if (!vnode.next && vnode.parent && vnode.parent.type !== VNodeType.TAG) {
        vnode.next = findNext(vnode.parent);
    }
    return vnode.next;
}

export function getNextDom(vnode: VNode): HTMLElement|Text|null {
    let cur: VNode|undefined = findNext(vnode);
    while (cur && !cur.firstDom) {
        cur = findNext(cur);
    }
    if (cur?.firstDom) return cur.firstDom;
    return null;
}

export function linkChildren(vnode: TagVNode | ComponentVNode) {
    vnode.children.forEach((child, index) => {
        child.parent = vnode;
        delete child.next;
        delete child.prev;
        if (index !== 0) child.prev = vnode.children[index - 1];
        else findPrev(child);
        if (index !== vnode.children.length - 1) child.next = vnode.children[index + 1];
        else findNext(child);
    })
    vnode.children.forEach(child => child.type !== VNodeType.TEXT && linkChildren(child));
}

export function insert(newVNode: VNode, index: number, parent: TagVNode | ComponentVNode) {
    if (index < 0 || !parent) return;
    if (index >= parent.children.length) {
        push(newVNode, parent);
        return;
    };
    const vnode = parent.children[index];
    newVNode.parent = parent;
    parent.children.splice(index, 0, newVNode);

    let prev: VNode|undefined = vnode.prev;
    while (prev) {
        prev.next = newVNode;
        // @ts-ignore
        prev = prev.children?.at(-1);
    }
    let next: VNode|undefined = newVNode;
    while (next) {
        next.prev = vnode.prev;
        // @ts-ignore
        next = next.children?.at(0);
    }
    prev = newVNode;
    while (prev) {
        prev.next = vnode;
        // @ts-ignore
        prev = prev.children?.at(-1);
    }
    next = vnode;
    while (next) {
        next.prev = newVNode;
        // @ts-ignore
        next = next.children?.at(0);
    }
}

function push(vnode: VNode, parent: TagVNode | ComponentVNode) {
    vnode.parent = parent;
    parent.children.push(vnode);

    let prev = parent.children.at(-2);
    while (prev) {
        prev.next = vnode;
        // @ts-ignore
        prev = prev.children?.at(-1);
    }
    let next = vnode;
    while (next) {
        next.prev = parent.children.at(-2);
        // @ts-ignore
        next = next.children?.at(0);
    }
}

export function remove(vnode: VNode): number {
    const parentVNode = vnode.parent;
    if (!parentVNode) return -1;
    const i = parentVNode.children.indexOf(vnode);
    if (i === -1) return -1;
    parentVNode.children.splice(i, 1);
    
    let prev: VNode|undefined = findPrev(vnode)
    while (prev) {
        prev.next = vnode.next;
        // @ts-ignore
        prev = prev.children?.at(-1);
    }
    let next: VNode|undefined = findNext(vnode)
    while (next) {
        next.prev = vnode.prev;
        // @ts-ignore
        next = next.children?.at(0);
    }

    return i;
}

export function updateChildren(vnode: TagVNode | ComponentVNode, newVNode: TagVNode | ComponentVNode) {
    const parent = (vnode.type === VNodeType.TAG ? vnode : getParentTag(vnode)!).firstDom!;
    
    const newKeyed = newVNode.children.reduce((acc, child) => {
        if (child.type !== VNodeType.TEXT && child.key) {
            acc[child.key] = child;
        }
        return acc;
    }, {} as Record<string, VNode>);
    const oldKeyed = vnode.children.reduceRight((acc, child) => {
        // @ts-ignore
        const key = child.key;
        if (key) {
            if (!newKeyed[key]) {
                destroy(child);  // remove if not present
            } else {
                acc[key] = child;
            }
        }
        return acc;
    }, {} as Record<string, VNode>);

    let j = 0;
    newVNode.children.forEach((child, index) => {
        // @ts-ignore
        const key = child.key;
        let oldChild;
        if (key) {
            oldChild = oldKeyed[key];
        } else {
            // @ts-ignore
            while (vnode.children[j]?.key) j++;
            oldChild = vnode.children[j];
        }
        if (oldChild) {
            if (vnode.children[index] !== oldChild) {
                remove(oldChild)
                insert(oldChild, index, vnode);
                putInDom(oldChild, parent, getNextDom(oldChild));
            }
            update(oldChild, child);
        } else {
            insert(child, index, vnode);
            render(child, parent, getNextDom(child));
        }
        j = Math.max(index + 1, j)
    })
    while (vnode.children.length > newVNode.children.length) {
        destroy(vnode.children.at(-1)!);
    }
}


