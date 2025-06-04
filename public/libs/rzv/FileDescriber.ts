import { Describer, DescriberContext, DescriberResult } from "./Describer";

export class FileDescriber extends Describer<File> {
    default: any = null;

    required(message: string = 'Required'): FileDescriber {
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value === null) {
                result.error = message;
                result.check = 'required';
            }
        }))
    }

    optional(): FileDescriber {
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value === null) {
                result.error = '';
                result.check = 'optional';
            }
        }));
    }

    min(size: number, message: string = `Min size is ${size}mb`): FileDescriber {
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
           if (result.value.size < size * 1024 * 1024) {
                result.error = message;
                result.check = 'minSize';
           }
        }));
    }

    max(size: number, message: string = `Max size is ${size}mb`): FileDescriber {
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
            if (result.value.size > size * 1024 * 1024) {
                result.error = message;
                result.check = 'maxSize';
            }
        }));
    }

    img(message: string = 'Not image'): FileDescriber {
        return this.type('image/(jpg|jpeg|png)', message);
    }

    mp3(message: string = 'Not mp3'): FileDescriber {
        return this.type('audio/mpeg', message);
    }

    type(type: string, message: string = `Not ${type}`): FileDescriber {
        const regex = new RegExp(`^${type}$`);
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
            if (!result.value.type.match(type)) {
                result.error = message;
                result.check = 'type';
            }
        }));
    }

    addUrl(): FileDescriber {
        return this.push(new FileDescriber((context: DescriberContext, result: DescriberResult) => {
            URL.revokeObjectURL(result.url);
            result.url = result.value && URL.createObjectURL(result.value);
        }));
    }

    clear(result: DescriberResult): void {
        if (result.url) {
            URL.revokeObjectURL(result.url);
        }
    }
}

export function file(): FileDescriber {
    return new FileDescriber((context: DescriberContext, result: DescriberResult) => {
        if (result.value !== null && !(result.value instanceof File)) {
            result.error = 'Not a file';
            result.check = 'file';
        }
    });
}
