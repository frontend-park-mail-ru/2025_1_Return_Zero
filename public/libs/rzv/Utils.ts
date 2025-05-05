import { DescriberContext } from "./Describer";

export class Reference {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    resolve(context: DescriberContext): null|any {
        if (this.name in context.results) return context.results[this.name].value;
        if (this.name in context) return context[this.name];
        return null;
    }
}

export function ref(name: string): Reference {
    return new Reference(name);
}

export type Condition = (context: Readonly<DescriberContext>) => boolean;


export function isOr(...conds: Condition[]): Condition {
    return (context: DescriberContext) => {
        return conds.some(c => c(context));
    }
}

export function isAnd(...conds: Condition[]): Condition {
    return (context: DescriberContext) => {
        return conds.every(c => c(context));
    }
}

export function isNotEmpty<T>(ref: Reference): Condition {
    return (context: DescriberContext) => {
        return !!ref.resolve(context);
    }
}

export function isRefOneOf<T>(ref: Reference, comps: (T|Reference)[]): Condition {
    return (context: DescriberContext) => {
        const val = ref.resolve(context);
        for (const c of comps) {
            const val2 = c instanceof Reference ? c.resolve(context) : c;
            if (val === val2) return true;
        }
        return false;
    }
}

export function alwaysTrue<T>(): Condition {
    return () => true;
}