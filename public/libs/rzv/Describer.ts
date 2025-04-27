import { Reference, Condition } from "./Utils";
import { Validator } from "./Validator";

export type DescriberContext = {
    readonly results: Record<string, DescriberResult>,
    readonly validator: Validator,
    readonly [key: string]: any
};

export type DescriberResult = {
    value?: any,
    error?: string,
    check?: string,
}

export type DescriberFunc<T> = (context: DescriberContext, result: DescriberResult) => void

export class Describer<T = any> {
    start: Describer;
    protected next: Describer | undefined;
    protected func: DescriberFunc<T>;

    constructor(func?: DescriberFunc<T>) {
        this.func = func || (() => {});
        this.start = this;
    }

    protected push<T extends Describer>(describer: T): T {
        describer.start = this.start || this;
        this.next = describer;
        return describer;
    }

    call(context: DescriberContext, result: DescriberResult): void {
        this.func(context, result);
        if (typeof result.error === 'string') return;
        if (this.next) this.next.call(context, result);
    };

    with(field: string): this {
        const constructor = this.constructor as new (func?: DescriberFunc<T>) => this;
        return this.push(new constructor((context: DescriberContext, result: DescriberResult) => {
            context.validator.validate(field, undefined, context);
        })) as this;
    }

    oneof(comps: (T|Reference)[], message: string = 'Invalid value'): this {
        const constructor = this.constructor as new (func?: DescriberFunc<T>) => this;
        return this.push(new constructor((context: DescriberContext, result: DescriberResult) => {
            for (const c of comps) {
                const val = c instanceof Reference ? c.resolve(context) : c;
                if (result.value === val) return;
            }
            result.error = message;
            result.check = 'oneof';
        })) as this;
    }

    ifThen(con: Condition, gen: (d: this) => this): this {
        const constructor = this.constructor as new (func?: DescriberFunc<T>) => this;
        const describer = gen(this);
        return this.push(new constructor((context: DescriberContext, result: DescriberResult) => {
            if (!con(context)) return;
            const c = { ...context };
            const r = { ...result };
            describer.call(c, r);
            if (typeof r.error === 'string') {
                Object.assign(context, c);
                Object.assign(result, r);
                return;
            }
        }));
    }
    
    /**
     * Run multiple variants of validators and return first one that return valid result.
     * If all variants return invalid result, return error message.
     * after or NO MORE DESCRIBERS can be added!!!
     * @param generators - list of functions that returns Describer. Each function takes this Describer as argument.
     * @param message - error message that will be returned if all variants return invalid result.
     * @returns Describer that run all variants and return first valid result.
     */
    or(generators: ((d: this) => Describer)[], message: string = 'Doesnt match any of variants'): Describer<T> {
        const variants: Describer[] = [];
        for (const gen of generators) {
            gen(this);
            variants.push(this.next);
        }
        return this.push(new Describer<T>((context: DescriberContext, result: DescriberResult) => {
            for (const variant of variants) {
                const c = { ...context };
                const r = { ...result };
                variant.call(c, r);
                if (typeof r.error !== 'string') {
                    Object.assign(context, c);
                    Object.assign(result, r);
                    return;
                };
            }
            result.error = message;
            result.check = 'or';
        }));
    }
}
