import { Describer, DescriberResult } from "./Describer";

export type ValidatorResult = DescriberResult & {
    unprocessed: string,
}

export class Validator {
    protected description: Record<string, Describer>
    result: Record<string, ValidatorResult>

    constructor(description: Record<string, Describer>, initialValue: Record<string, string> = {}) {
        this.result = {}
        this.description = description;
        for (const key in description) {
            this.description[key] = this.description[key].start;
            this.result[key] = { unprocessed: initialValue[key] || description[key].default };
        }
    }

    ok(key?: string): boolean {
        if (!key) return Object.values(this.result).every(r => !Boolean(r.error));
        return !Boolean(this.result[key].error);
    }

    validate(key: string, value?: any, context: Record<string, any> = {}): boolean {
        this.result[key] = {
            unprocessed: value === undefined ? this.result[key].unprocessed : value,
            value: value === undefined ? this.result[key].unprocessed : value
        };
        this.description[key].call({ ...context, results: this.result, validator: this }, this.result[key]);
        return this.ok(key);
    }

    validateAll(context?: Record<string, any>): boolean {
        for (const key in this.description) {
            this.validate(key, this.result[key].unprocessed, context);
        }
        return this.ok();
    }

    clear(): void {
        Object.keys(this.description).forEach(
            key => this.result[key] = {
                unprocessed: ''
            }
        )
    }
}