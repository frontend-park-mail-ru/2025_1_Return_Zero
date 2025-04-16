export class Describer {
    protected _prev?: Describer = null;
    protected _args: any[] = [];
    protected _func: (...args: any[]) => any;

    protected constructor (func: (...args: any[]) => any, ...args: any[]) {
        this._func = func;
        this._args = args;
    }

    protected put(describer: Describer): Describer {
        describer._prev = this;
        return describer;
    }

    call(value: any) {
        if (this._prev)
            value = this._prev.call(value);
        return this._func(value, ...this._args);
    }

    get prev() {
        return this._prev;
    }

    get args() {
        return this._args;
    }

    get method() {
        return this._func;
    }

    static string(): StringDescriber {
        return new StringDescriber(Describer.applyString);
    }

    static applyString(value: any): string {
        return value.toString()
    }

    static number(): NumberDescriber {
        return new NumberDescriber(Describer.applyNumber);
    }

    static applyNumber(value: any): number {
        const res = Number(value)
        if (isNaN(res))
            throw new Error('Not a number');
        return res
    }
}


export class StringDescriber extends Describer {
    min(n: number, message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyMin, n, message)
        ) as StringDescriber;
    }

    protected static applyMin(value: string, n: number, message?: string) {
        if (value.length < n)
            throw (message ? new Error(message) : new Error(`Min length is ${n}`));
        return value;
    }

    max(n: number, message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyMax, n, message)
        ) as StringDescriber;
    }

    protected static applyMax(value: string, n: number, message?: string) {
        if (value.length > n)
            throw (message ? new Error(message) : new Error(`Max length is ${n}`));
        return value;
    }

    email(message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyEmail, message)
        ) as StringDescriber;
    }

    protected static applyEmail(value: string, message?: string) {
        if (!value.match(/^[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+\.[a-z]+$/))
            throw (message ? new Error(message) : new Error('Invalid email'));
        return value;
    }

    contains(value: string, message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyContains, value, message)
        ) as StringDescriber;
    }

    protected static applyContains(value: string, contains: string, message?: string) {
        if (!value.match(new RegExp(`[${contains}]`)))
            throw (message ? new Error(message) : new Error('Does not contain'));
        return value;
    }

    characters(characters: string, message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyCharacters, characters, message)
        ) as StringDescriber;
    }

    protected static applyCharacters(value: string, characters: string, message?: string) {
        if (!value.match(new RegExp(`^[${characters}]*$`)))
            throw (message ? new Error(message) : new Error('Invalid characters'));
        return value;
    }

    pattern(pattern: RegExp, message?: string): StringDescriber {
        return this.put(
            new StringDescriber(StringDescriber.applyPattern, pattern, message)
        ) as StringDescriber;
    }

    protected static applyPattern(value: string, pattern: RegExp, message?: string) {
        if (!value.match(pattern))
            throw (message ? new Error(message) : new Error('Invalid pattern'));
        return value;
    }
}


export class NumberDescriber extends Describer {
    min(n: number, message?: string): NumberDescriber {
        return this.put(
            new NumberDescriber(NumberDescriber.applyMin, n, message)
        ) as NumberDescriber;
    }

    protected static applyMin(value: number, n: number, message?: string) {
        if (value < n)
            throw (message ? new Error(message) : new Error(`Min value is ${n}`));
        return value;
    }

    max(n: number, message?: string): NumberDescriber {
        return this.put(
            new NumberDescriber(NumberDescriber.applyMax, n, message)
        ) as NumberDescriber;
    }

    protected static applyMax(value: number, n: number, message?: string) {
        if (value > n)
            throw (message ? new Error(message) : new Error(`Max value is ${n}`));
        return value;
    }

    integer(message?: string): NumberDescriber {
        return this.put(
            new NumberDescriber(NumberDescriber.applyInteger, message)
        ) as NumberDescriber;
    }

    protected static applyInteger(value: number, message?: string) {
        if (!Number.isInteger(value))
            throw (message ? new Error(message) : new Error('Not an integer'));
        return value;
    }
}
