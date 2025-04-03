import { requirements } from './requirements';

type Input = {
    type: 'text' | 'email' | 'password';
    text: string;
    name: string; 
    errorName: string; 
    placeholder: string;
};

class InputState {
    form: HTMLFormElement;
    input: Input;
    inputHTML: HTMLInputElement;
    validationMessage: HTMLParagraphElement;

    valid: boolean;
    loginForm: boolean;
    error: string | null;

    constructor(form: HTMLFormElement, input: Input, loginForm: boolean) {
        this.form = form;
        this.input = input;
        this.loginForm = loginForm;
        this.inputHTML = this.form.querySelector(
            `[name="${this.input.name}"]`
        ) as HTMLInputElement;
        this.validationMessage = this.form.querySelector(
            `[name="${this.input.name}-error"]`
        ) as HTMLParagraphElement; 

        this.inputHTML.addEventListener('input',
            this.inputListener.bind(this)
        );

        this.valid = false;
        this.error = null;
    }

    setState(newState: boolean, errorMessage: string | null) {
        this.valid = newState;
        this.error = errorMessage;

        this.mark();
    }

    mark() {
        if(!this.validationMessage || this.loginForm) {
            return;
        }

        if (!this.valid) {
            this.validationMessage.textContent = this.error;
            this.inputHTML.classList.add('border-error'); 
            return;
        }
        this.validationMessage.textContent = this.error;
        this.inputHTML.classList.remove('border-error'); 
    }

    isValid() {
        return this.valid;
    }

    inputListener() {
        const requirement = requirements[this.input.name as keyof typeof requirements];
        const text: string = this.inputHTML.value;

        let errorMessage: string | undefined;
        if (text.length < requirement.minLength || text.length > requirement.maxLength) {
            errorMessage = requirement.errorMessages.length;
        }
        if (requirement.containsLetter && !requirement.containsLetter(text)) {
            errorMessage = requirement.errorMessages.containsLetter;
        }
        if (requirement.containsValidChars && !requirement.containsValidChars(text)) {
            errorMessage = requirement.errorMessages.containsValidChars;
        }
        if (requirement.match) {
            if (this.input.name === 'passwordRepeat') {
                const password: string | null = (
                    this.form.querySelector(`[name="password"]`) as HTMLInputElement
                ).value;
                if (password && !requirement.match(text, password)) {
                    errorMessage = requirement.errorMessages.match;
                }
            }
            if (this.input.name !== 'passwordRepeat' && !requirement.match(text)) {
                errorMessage = requirement.errorMessages.match;
            }
        }
        
        if (errorMessage) {
            this.setState(false, errorMessage);
            return;
        }  
        this.setState(true, null);

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

