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
    private _values: FormValues = {};
    private _form: HTMLFormElement;

    constructor (config: FormConfig) {
        this._config = config;
        this._errors = Object.keys(config).reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {} as FormErrors);
        this._values = Object.keys(config).reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {} as FormValues);
    }

    bind(form: HTMLFormElement) {
        if (this._form)
            throw new Error('Form already bound');
        this._form = form;
        Object.keys(this._config).forEach(key => {
            const input = this._form.querySelector(`[data-rzv="${key}"]`);
            const error = this._form.querySelector(`[data-rzv=${key}-error]`);
            if (!input || !error) {
                console.error(`Element with data-rzv="${key}" not found or data-rzv="${key}-error" not found`);
                return;
            }
            const onHandle = (e: Event) => {
                const res = new Validator(this._config[key])
                    .validate((input as HTMLInputElement).value); 
                this._errors[key] = res[0];
                this._values[key] = res[1];
                error.textContent = res[0];             
            }
            input.addEventListener('input', (e) => onHandle(e));
        });
    }

    validate(values: FormValues) {
        this._values = values;
        Object.keys(this._config).forEach(key => {
            const res = new Validator(this._config[key]).validate(values[key]);
            this._errors[key] = res[0];
            this._values[key] = res[1];
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