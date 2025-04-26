export type DescriberContext<T> = {
    value: T,
    readonly results: Record<string, DescriberResult>,
};

export type DescriberResult = {
    value?: any,
    error?: string,
    check?: string,
}

export type DescriberFunc<T> = (context: DescriberContext<T>, result: DescriberResult) => void

export class Describer<T = any> {
    protected start: Describer;
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

    call(context: DescriberContext<T>, result: DescriberResult): void {
        this.func(context, result);
        if (typeof result.error === 'string') return;
        if (this.next) this.next.call(context, result);
    };

    required(message: string = 'Required'): this {
        const constructor = this.constructor as new (func?: DescriberFunc<T>) => this;
        return this.push(new constructor((context: DescriberContext<T>, result: DescriberResult) => {
            if (!context.value) {
                result.error = message;
                result.check = 'required';
            };
        })) as this;
    }

    oneof(comps: (T|Reference)[], message: string = 'Invalid value'): this {
        const constructor = this.constructor as new (func?: DescriberFunc<T>) => this;
        return this.push(new constructor((context: DescriberContext<T>, result: DescriberResult) => {
            for (const c of comps) {
                const val = c instanceof Reference ? c.resolve(context) : c;
                if (context.value !== val) {
                    result.error = message;
                    result.check = 'oneof';
                    return;
                };
            }
        })) as this;
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
        for (const generator of generators) {
            generator(this);
            variants.push(this.next);
        }
        return this.push(new Describer<T>((context: DescriberContext<T>, result: DescriberResult) => {
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

export class Reference {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    resolve(context: DescriberContext<any>): any {
        return context.results[this.name].value;
    }
}

export function ref(name: string): Reference {
    return new Reference(name);
}
