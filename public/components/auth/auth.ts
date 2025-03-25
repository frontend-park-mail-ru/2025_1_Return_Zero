import './auth.css';
import './auth.precompiled.js';

import { postSignup, postLogin } from '../../utils/api.js';
import { renderPage } from '../../renderPage.js';
import { updateHeader } from '../header/header.js';

import { inputManipulator } from './inputManipulator';
import { popUpListener } from './popUpListener';

interface Input {
    type: string,
    text: string,
    name: string,
    errorName: string,
    placeholder: string
}

interface AuthFormData {
    inputs: Input[],
    submitText: string,
    header: string
}

interface SendingData {
    username?: string,
    email?: string,
    password: string,
    passwordRepeat?: string
}

/**
 * Makes the login form.
 *
 * @returns {HTMLFormElement} A form element containing the login form.
 */
export function loginForm(): HTMLFormElement {
    // @ts-ignore хз, как сделать так, чтобы на Handlebars не ругался ts
    const template = Handlebars.templates['auth.hbs'];
    const formData: AuthFormData = {
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

    const form: HTMLFormElement = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);

    setTimeout(() => {
        form.addEventListener('mousedown', popUpListener.formClickListener);
    }, 0);

    // real-time validation
    formData.inputs.forEach((input) => {
        const element: HTMLInputElement | null = form.querySelector(`[name=${input.name}]`);
        if (element) {
            setTimeout(() => {
                element.addEventListener('input', inputManipulator.inputListener);
            }, 0);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const password: HTMLInputElement | null = (
            form.querySelector(`[name="password"]`) as HTMLInputElement
        );
        const identifier: HTMLInputElement | null = (
            form.querySelector(`[name="identifier"]`) as HTMLInputElement
        );
        
        let hasError = false;
        const validationList = [identifier, password];
        validationList.forEach((input) => {
            if (!input || input.classList.contains('border-error')) {
                hasError = true;
                return;
            }
        });
        if (hasError) {
            return;
        }

        const sendingData: SendingData = {
            password: password.value,
        };

        if (identifier.value.includes('@')) {
            sendingData.email = identifier.value;
        } else {
            sendingData.username = identifier.value;
        }

        inputManipulator.renderGlobalError('');
        postLogin(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
            inputManipulator.renderGlobalError('Неправильные логин/email или пароль');
        });
    });

    return form;
}

/**
 * Makes the signup form.
 *
 * @returns {HTMLDivElement} A div element containing the signup form.
 */
export function signupForm() {
    // @ts-ignore хз, как сделать так, чтобы на Handlebars не ругался ts
    const template = Handlebars.templates['auth.hbs'];
    const formData: AuthFormData = {
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

    const form = document.createElement('form');
    form.classList.add('auth-form');
    form.innerHTML = template(formData);

    setTimeout(() => {
        form.addEventListener('mousedown', popUpListener.formClickListener);
    }, 0);

    // real-time validation
    formData.inputs.forEach((input) => {
        const element: HTMLInputElement | null = form.querySelector(`[name=${input.name}]`);
        if (element) {
            setTimeout(() => {
                element.addEventListener('input', inputManipulator.inputListener);
            }, 0);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const password: HTMLInputElement | null = (
            form.querySelector(`[name="password"]`) as HTMLInputElement
        );
        const passwordRepeat: HTMLInputElement | null = (
            form.querySelector(`[name="passwordRepeat"]`) as HTMLInputElement
        );
        const username: HTMLInputElement | null = (
            form.querySelector(`[name="username"]`) as HTMLInputElement
        );
        const email: HTMLInputElement | null = (
            form.querySelector(`[name="email"]`) as HTMLInputElement
        );

        let hasError = false;
        const validationList = [password, passwordRepeat, username, email];
        validationList.forEach((input) => {
            if (!input || input.classList.contains('border-error')) {
                hasError = true;
                return;
            }
        });
        if (hasError) {
            return;
        }

        const sendingData: SendingData = {
            username: username.value,
            email: email.value,
            password: password.value,
            passwordRepeat: passwordRepeat.value,
        };

        inputManipulator.renderGlobalError('');
        postSignup(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
            inputManipulator.renderGlobalError('Пользователь с таким логин/email уже существует');
        });
    });

    return form;
}

