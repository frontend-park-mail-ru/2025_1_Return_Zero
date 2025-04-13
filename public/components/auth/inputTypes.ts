import { requirements } from './requirements';

type Input = {
    type: 'text' | 'email' | 'password';
    text: string;
    name: string;
    errorName: string;
    placeholder: string;
};

class InputState {
    form?: HTMLFormElement
    input: HTMLInputElement;
    validationMessage: HTMLElement;
    validationKey: string;

    valid: boolean;
    showValidate: boolean;
    formType: string;
    error: string | null;

    constructor(input: HTMLInputElement, validationMessage: HTMLElement, validationKey: string, formType: string, form?: HTMLFormElement) {
        if (form) {
            this.form = form;
        }
        this.input = input;
        this.validationMessage = validationMessage;
        this.validationKey = validationKey;
        this.formType = formType;
        this.showValidate = false;
        if (formType == 'login') {
            this.showValidate = true;
        }
        
        this.input.addEventListener('input', this.inputListener.bind(this));

        this.valid = false;
        this.error = null;
    }

    setState(newState: boolean, errorMessage: string | null) {
        this.valid = newState;
        this.error = errorMessage;

        this.mark();
    }

    mark() {
        if (!this.validationMessage || this.showValidate) {
            return;
        }

        if (!this.valid) {
            this.validationMessage.textContent = this.error;
            this.input.classList.add('border-error');
            return;
        }
        this.validationMessage.textContent = this.error;
        this.input.classList.remove('border-error');
    }

    isValid() {
        return this.valid;
    }

    inputListener(event: Event) {
        const requirement =
            requirements[this.validationKey as keyof typeof requirements];
        const text: string = this.input.value;

        if (this.formType == 'settings' && text.length == 0) {
            this.setState(true, null);
            return;
        }

        let errorMessage: string | undefined;
        if (
            text.length < requirement.minLength ||
            text.length > requirement.maxLength
        ) {
            errorMessage = requirement.errorMessages.length;
        }
        if (requirement.containsLetter && !requirement.containsLetter(text)) {
            errorMessage = requirement.errorMessages.containsLetter;
        }
        if (
            requirement.containsValidChars &&
            !requirement.containsValidChars(text)
        ) {
            errorMessage = requirement.errorMessages.containsValidChars;
        }

        if (requirement.match) {
            if (this.input.name === 'passwordRepeat') {
                const password: string | null = (
                    this.form.querySelector(
                        `[name="password"]`
                    ) as HTMLInputElement
                ).value;
                if (password && !requirement.match(text, password)) {
                    errorMessage = requirement.errorMessages.match;
                }
            }
            if (
                this.input.name !== 'passwordRepeat' &&
                !requirement.match(text)
            ) {
                errorMessage = requirement.errorMessages.match;
            }
        }

        if (errorMessage) {
            this.setState(false, errorMessage);
            return;
        }
        this.setState(true, null);

        if (!event.isTrusted) {
            return;
        }

        if (this.input.name === 'password') {
            const passwordRepeatInput = this.form.querySelector(
                '[name="passwordRepeat"]'
            ) as HTMLInputElement;
            if (passwordRepeatInput) {
                passwordRepeatInput.dispatchEvent(new Event('input'));
            }
        } else if (this.input.name === 'passwordRepeat') {
            const passwordInput = this.form.querySelector(
                '[name="password"]'
            ) as HTMLInputElement;
            if (passwordInput) {
                passwordInput.dispatchEvent(new Event('input'));
            }
        }
    }
}

const signupContent = {
    inputs: [
        {
            type: 'text',
            text: 'Введите логин:',
            name: 'username',
            errorName: 'username-error',
            placeholder: 'логин',
        },
        {
            type: 'email',
            text: 'Введите email:',
            name: 'email',
            errorName: 'email-error',
            placeholder: 'email',
        },
        {
            type: 'password',
            text: 'Введите пароль:',
            name: 'password',
            errorName: 'password-error',
            placeholder: 'пароль',
        },
        {
            type: 'password',
            text: 'Повторите пароль:',
            name: 'passwordRepeat',
            errorName: 'passwordRepeat-error',
            placeholder: 'пароль',
        },
    ],
    submitText: 'Зарегистрироваться',
    header: 'Регистрация',
};

const loginContent = {
    inputs: [
        {
            type: 'text',
            text: 'Введите логин/email:',
            name: 'identifier',
            errorName: 'identifier-error',
            placeholder: 'логин/email',
        },
        {
            type: 'password',
            text: 'Введите пароль:',
            name: 'password',
            errorName: 'password-error',
            placeholder: 'пароль',
        },
    ],
    submitText: 'Войти',
    header: 'Авторизация',
};

export { Input, InputState, signupContent, loginContent };