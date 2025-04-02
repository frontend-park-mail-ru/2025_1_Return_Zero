import './auth.css';
import './auth.precompiled.js';

import { postSignup, postLogin } from '../../utils/api.js';
import { renderPage } from '../../renderPage.js';
import { updateHeader } from '../header/header.js';

import { Input, InputState } from './inputTypes';
import { popUpListener } from './popUpListener';

type AuthFormData = {
    inputs: Input[],
    submitText: string,
    header: string
}

interface SendingData {
    identifier?: string,
    username?: string,
    email?: string,
    password?: string,
    passwordRepeat?: string
}

function renderGlobalError(text: string): void {
    const errorMessage: HTMLParagraphElement | null = document.querySelector(
        `[name="global-error"]`
    );
    if (!errorMessage) {
        return;
    }

    errorMessage.textContent = text;
    errorMessage.className = 'error-message';
}

/**
 * Makes the login form.
 *
 * @returns {HTMLFormElement} A form element containing the login form.
 */
export function loginForm(): HTMLFormElement {
    // @ts-ignore 
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

    const inputList: InputState[] = [];
    formData.inputs.forEach((input) => {
        if(!input) return;
        const element: InputState = new InputState(form, input, true);
        inputList.push(element);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let hasError = false;
        const sendingData: SendingData = {};
        inputList.forEach((inputState) => {
            if (!inputState.isValid()) {
                hasError = true;
            }
            sendingData[inputState.input.name as keyof SendingData] = inputState.inputHTML.value;
        });
        
        if (hasError) {
            return;
        }

        if (sendingData.identifier && sendingData.identifier.includes('@')) {
            sendingData.email = sendingData.identifier;
        } else {
            sendingData.username = sendingData.identifier;
        }

        renderGlobalError('');
        postLogin(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
            renderGlobalError('Неправильные логин/email или пароль');
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

    const inputList: InputState[] = [];
    formData.inputs.forEach((input) => {
        if(!input) return;
        const element: InputState = new InputState(form, input, false);
        inputList.push(element);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let hasError = false;
        const sendingData: SendingData = {};
        inputList.forEach((inputState) => {
            if (!inputState.isValid()) {
                hasError = true;
            }
            sendingData[inputState.input.name as keyof SendingData] = inputState.inputHTML.value;
        });
        
        if (hasError) {
            return;
        }

        renderGlobalError('');
        postSignup(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
            renderGlobalError('Пользователь с таким логин/email уже существует');
        });
    });

    return form;
}

