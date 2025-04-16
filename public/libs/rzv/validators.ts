import { Describer } from "./describers";

export class Validator {
    protected _describer: Describer;

    constructor(describer: Describer) {
        this._describer = describer;
    }

    get describer() {
        return this._describer;
    }

    validate(value: any): string|null {
        let describer = this._describer;
        try {
            while (describer) {
                value = describer.method()(value, ...describer.args);
                describer = describer.prev;
            }
        } catch (e) {
            return e.message;
        }
        return null;
    }
}