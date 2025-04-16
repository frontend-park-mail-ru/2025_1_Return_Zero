import { Describer } from "./describers";
import { Validator } from "./validators";


export type FormConfig = {
    [key: string]: Describer
}

export type FormErrors = {
    [key: string]: string|null
}

export type FormValues = {
    [key: string]: any
}

export class Form {
    private _config: FormConfig = {};
    private _errors: FormErrors = {};
    private _values: FormValues;

    constructor (config: FormConfig) {
        this._config = config;
        this._errors = Object.keys(config).reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {} as FormErrors);
    }

    bind(form: HTMLFormElement) {
        Object.keys(this._config).forEach(key => {
            let input = form.querySelector(`[data-rzv="${key}"]`);
            if (input) {
                const onHandle = (e: Event) => {
                    this._errors[key] = new Validator(this._config[key])
                        .validate((input as HTMLInputElement).value);                    
                }
                input.addEventListener('input', (e) => onHandle(e)); 
            }
        });
    }

    validate(values: FormValues) {
        this._values = values;
        Object.keys(this._config).forEach(key => {
            this._errors[key] = new Validator(this._config[key]).validate(values[key]);
        });
    }

    okay(): boolean {
        return Object.keys(this._errors).every(key => this._errors[key] === null);
    }

    get errors() {
        return this._errors;
    }

    get values() {
        return this._values;
    }
}