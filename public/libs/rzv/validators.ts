import { Describer } from "./describers";

export class Validator {
    protected _describer: Describer;

    constructor(describer: Describer) {
        this._describer = describer;
    }

    get describer() {
        return this._describer;
    }

    validate(value: any): [string|null, null|any] {
        try {
            value = this._describer.call(value);
        } catch (e) {
            return [e.message, null];
        }
        return [null, value];
    }
}
