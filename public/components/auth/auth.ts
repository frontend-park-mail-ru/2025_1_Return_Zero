import './auth.css';
import './auth.precompiled.js';
import './requirements.ts';

import { postSignup, postLogin } from '../../utils/api.js';
import { renderPage } from '../../renderPage.js';
import { updateHeader } from '../header/header.js';

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

function markInput(target: HTMLInputElement, errorMessage: string) {
    const validationMessage = document.querySelector(
        `[name="${target.name}-error"]`
    );
    if (validationMessage) {
        validationMessage.textContent = errorMessage;
    }
}

function inputListener(event: Event) {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    if(!target || !target.name || !(target.name in requirements)) {
        return;
    }

    const requirement: Requirement = requirements[target.name as keyof Requirements]; 
    const text: string = target.value;

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
        if (target.name == 'passwordRepeat') {
            const password: string | null = (
                document.querySelector(`[name="password"]`) as HTMLInputElement
            ).value;
            if (password && !requirement.match(text, password)) {
                errorMessage = requirement.errorMessages.match;
            }
        }
        if (target.name != 'passwordRepeat' && !requirement.match(text)) {
            errorMessage = requirement.errorMessages.match;
        }
    }

    if (errorMessage) {
        markInput(target, errorMessage);
    }
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
        form.addEventListener('mousedown', formClickListener);
    }, 0);

    // real-time validation
    formData.inputs.forEach((input) => {
        const element: HTMLInputElement | null = document.querySelector(`[name=${input.name}]`);
        if (element) {
            setTimeout(() => {
                element.addEventListener('input', inputListener);
            }, 0);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const password: string | null = (
            document.querySelector(`[name="password"]`) as HTMLInputElement
        ).value;
        const identifier: string | null = (
            document.querySelector(`[name="identifier"]`) as HTMLInputElement
        ).value;

        if (!identifier || !password) {
            return;
        }

        const sendingData: SendingData = {
            password: password,
        };

        if (identifier.includes('@')) {
            sendingData.email = identifier;
        } else {
            sendingData.username = identifier;
        }

        postLogin(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
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
        form.addEventListener('mousedown', formClickListener);
    }, 0);

    // real-time validation
    formData.inputs.forEach((input) => {
        const element: HTMLInputElement | null = document.querySelector(`[name=${input.name}]`);
        if (element) {  const username: string | null = (
            document.querySelector(`[name="username"]`) as HTMLInputElement
        ).value;
            setTimeout(() => {
                element.addEventListener('input', inputListener);
            }, 0);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const password: string | null = (
            document.querySelector(`[name="password"]`) as HTMLInputElement
        ).value;
        const passwordRepeat: string | null = (
            document.querySelector(`[name="passwordRepeat"]`) as HTMLInputElement
        ).value;
        const username: string | null = (
            document.querySelector(`[name="username"]`) as HTMLInputElement
        ).value;
        const email: string | null = (
            document.querySelector(`[name="email"]`) as HTMLInputElement
        ).value;

        if (!email || !password || !username || !passwordRepeat) {
            return;
        }

        const sendingData: SendingData = {
            username: username,
            email: email,
            password: password,
            passwordRepeat: passwordRepeat,
        };

        postSignup(sendingData, (response: Response) => {
            if (response.ok) {
                renderPage();
                updateHeader();
                return;
            } 
        });
    });

    return form;
}

/**
 * Removes the authentication form from the DOM when it is clicked outside of it.
 * @param {Event} event - The event triggered by the click.
 */
function formClickListener(event: Event) {
    const authWindow: HTMLDivElement | null = document.getElementById('auth') as HTMLDivElement;;

    if (authWindow && event.target instanceof Node && !authWindow.contains(event.target)) {
        const root: HTMLDivElement | null = document.getElementById('root') as HTMLDivElement;
        const authForm: HTMLFormElement | null = event.currentTarget as HTMLFormElement;

        if (authForm && event.currentTarget instanceof Node) {
            authForm.removeEventListener('mousedown', formClickListener);
            root.removeChild(event.currentTarget);

            document
            .querySelectorAll('.header__login.active, .header__signup.active')
            .forEach((button) => {
                button.classList.remove('active');
            });
        }
    }
}

