import { Describer, DescriberContext, DescriberResult } from "./Describer";

export class StringDescriber extends Describer<string> {
    min(length: number, message: string = `Min length is ${length}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext<string>, result: DescriberResult) => {
            if (context.value.length < length) {
                result.error = message;
                result.check = 'min';
            };
        })) as StringDescriber;
    }

    max(length: number, message: string = `Max length is ${length}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext<string>, result: DescriberResult) => {
            if (context.value.length > length) {
                result.error = message;
                result.check = 'max';
            };
        })) as StringDescriber;
    }

    email(message: string = 'Invalid email'): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext<string>, result: DescriberResult) => {
            if (!context.value.match(/^(\w+\.?)+@(\w+\.)+[a-z]+$/)) {
                result.error = message;
                result.check = 'email';
            };
        })) as StringDescriber;
    }

    contains(value: string, message: string = `Does not contain ${value}`): StringDescriber {
        return this.match(new RegExp(value), message);
    }

    containsOneOf(values: string, message: string = `Does not contain one of ${values}`): StringDescriber {
        return this.match(new RegExp(`[${values}]`), message);
    }

    consistOf(characters: string, message: string = `Allowed characters ${characters}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext<string>, result: DescriberResult) => {
            if (!context.value.match(new RegExp(`^[${characters}]+$`))) {
                result.error = message;
                result.check = 'consistOf';
            };
        })) as StringDescriber;
    }

    match(pattern: RegExp, message: string = `Does not match ${pattern}`): StringDescriber {
        return this.push(new StringDescriber((context: DescriberContext<string>, result: DescriberResult) => {
            if (!context.value.match(pattern)) {
                result.error = message;
                result.check = 'match';
            };
        })) as StringDescriber;
    }
}

export function string(): StringDescriber {
    return new StringDescriber((context: DescriberContext<any>, result: DescriberResult) => {
        if (typeof context.value !== 'string') {
            result.error = 'Not a string';
            result.check = 'type';
            return;
        }
        context.value = result.value = context.value.trim();
        if (context.value === '') {
            result.error = '';
            return;
        };
    });    
}
