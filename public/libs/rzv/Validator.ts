import { DescriberResult } from "./Describer";

export type ValidatorResult = DescriberResult & {
    uprocessed: any
}

export class Validator {
    protected description: Record<string, any>
    result: Record<string, ValidatorResult>

    constructor(description: Record<string, any>, initialValue: Record<string, string> = {}) {
        this.result = {}
        this.description = description;
        for (const key in description) {
            this.description[key] = this.description[key].start;
            this.validate(key, initialValue[key] || '');
        }
    }

    ok(key?: string): boolean {
        if (!key) return Object.values(this.result).every(result => result.error === undefined);
        return this.result[key].error === undefined;
    }

    validate(key: string, value: any): boolean {
        this.result[key] = {
            uprocessed: value,
        };
        this.description[key].call({ value, results: this.result }, this.result[key]);
        return this.ok(key);
    }

    validateAll(value?: any): boolean {
        value = value || this.result;
        for (const key in this.description) {
            this.validate(key, value[key]);
        }
        return this.ok();
    }
}