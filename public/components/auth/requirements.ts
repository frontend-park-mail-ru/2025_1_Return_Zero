const validLetters = new Set([
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
]);
const validLoginChars = new Set([...validLetters, '_', ...'0123456789']);
const validEmailChars = new Set([...validLoginChars, ...'@#!.']);
const emailRegexp = /.+@.+\..+/i;

function globalValidLoginCharsChecker(text: string): boolean {
    return [...text].every((char) => validLoginChars.has(char));
}

function globalValidEmailCharsChecker(text: string): boolean {
    return [...text].every((char) => validEmailChars.has(char));
}

function globalLetterChecker(text: string): boolean {
    return [...text].some((char) => validLetters.has(char));
}

interface Requirement {
    minLength: number;
    maxLength: number;

    containsLetter?(text: string): boolean;
    containsValidChars?(text: string): boolean;
    match?(text: string, matchingValue?: string): boolean;

    errorMessages: {
        length?: string;
        containsLetter?: string;
        containsValidChars?: string;
        match?: string;
    };
}

class Requirements {
    password: Requirement;
    passwordRepeat: Requirement;
    username: Requirement;
    email: Requirement;
    identifier: Requirement;

    constructor() {
        this.password = {
            minLength: 4,
            maxLength: 25,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
            errorMessages: {
                length: 'Пароль должен быть от 4 до 25 символов',
                containsLetter: 'Пароль должен содержать хотя бы одну букву',
                containsValidChars:
                    'Пароль может содержать только латинские буквы, цифры и подчеркивания',
            },
        };

        this.passwordRepeat = {
            minLength: 4,
            maxLength: 25,
            match: (text: string, matchingValue?: string): boolean =>
                text === matchingValue,
            errorMessages: {
                length: 'Пароли не совпадают',
                match: 'Пароли не совпадают',
            },
        };

        this.username = {
            minLength: 3,
            maxLength: 20,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
            errorMessages: {
                length: 'Логин должен быть от 3 до 20 символов',
                containsLetter: 'Логин должен содержать хотя бы одну букву',
                containsValidChars:
                    'Логин может содержать только латинские буквы, цифры и подчеркивания',
            },
        };

        this.email = {
            minLength: 5,
            maxLength: 30,
            containsValidChars: globalValidEmailCharsChecker,
            match: (text: string): boolean => emailRegexp.test(text),
            errorMessages: {
                length: 'Email должен быть от 5 до 30 символов',
                containsValidChars: 'Введите корректный email',
                match: 'Введите корректный email',
            },
        };

        this.identifier = {
            minLength: 3,
            maxLength: 30,
            containsValidChars: globalValidEmailCharsChecker,
            errorMessages: {},
        };
    }
}

export const requirements = new Requirements();
