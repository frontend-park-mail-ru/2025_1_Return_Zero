import { Describer, DescriberContext, DescriberResult } from "./Describer";

export class StringDescriber extends Describer<string> {
    default: string = "";

    required(message: string = 'Required'): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value === '') {
                result.error = message;
                result.check = 'required';
            }
        }))
    }

    optional(): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value === '') {
                result.error = '';
                result.check = 'optional';
            }
        }));
    }

    min(length: number, message: string = `Min length is ${length}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value.length < length) {
                result.error = message;
                result.check = 'min';
            };
        }));
    }

    max(length: number, message: string = `Max length is ${length}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value.length > length) {
                result.error = message;
                result.check = 'max';
            };
        }));
    }

    email(message: string = 'Invalid email'): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (!result.value.match(/^(\w+\.?)+@(\w+\.)+[a-z]+$/)) {
                result.error = message;
                result.check = 'email';
            };
        }));
    }

    contains(value: string, message: string = `Does not contain ${value}`): StringDescriber {
        return this.match(new RegExp(value), message);
    }

    containsOneOf(values: string, message: string = `Does not contain one of ${values}`): StringDescriber {
        return this.match(new RegExp(`[${values}]`), message);
    }

    consistOf(characters: string, message: string = `Allowed characters ${characters}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (!result.value.match(new RegExp(`^[${characters}]+$`))) {
                result.error = message;
                result.check = 'consistOf';
            };
        }));
    }

    match(pattern: RegExp, message: string = `Does not match ${pattern}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext, result: DescriberResult) => {
            if (!result.value.match(pattern)) {
                result.error = message;
                result.check = 'match';
            };
        }));
    }
}

export function string(): StringDescriber {
    return new StringDescriber((context: DescriberContext, result: DescriberResult) => {
        result.value = result.value.toString().trim();
    });    
}
